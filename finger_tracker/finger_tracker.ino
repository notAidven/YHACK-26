/*
  Finger Extension Tracker + BNO055 IMU - ESP32 Firmware (Access Point Mode)
  ===========================================================================
  Hotspot name:     FingerTracker
  Hotspot password: (none)
  Dashboard URL:    ws://192.168.4.1:81

  ── Flex Sensor Pinout ──────────────────────────────────────────────────────
    Thumb  -> GPIO32
    Index  -> GPIO33
    Middle -> GPIO34
    Ring   -> GPIO35
    Pinky  -> GPIO39

  Each pot: Left leg -> GND | Wiper -> GPIO | Right leg -> 3.3V

  ── BNO055 Pinout (I2C) ─────────────────────────────────────────────────────
    BNO055 VIN  -> 3.3V
    BNO055 GND  -> GND
    BNO055 SDA  -> GPIO21   (ESP32 default I2C SDA)
    BNO055 SCL  -> GPIO22   (ESP32 default I2C SCL)
    BNO055 ADR  -> GND      (sets I2C address to 0x28; tie to 3.3V for 0x29)
    BNO055 PS0  -> GND      (leave floating or GND to keep I2C mode)
    BNO055 PS1  -> GND      (leave floating or GND to keep I2C mode)
    BNO055 RST  -> (not connected, or tie to a GPIO if you need hard reset)
    BNO055 INT  -> (not connected, optional interrupt output)

  NOTE: The BNO055 runs at 3.3V logic — safe to connect directly to ESP32.
        No level shifting needed. Keep I2C wires short (< 20 cm) for stability.

  ── Libraries needed (Arduino Library Manager) ──────────────────────────────
    - "WebSockets" by Markus Sattler
    - "ArduinoJson" by Benoit Blanchon
    - "Adafruit BNO055" by Adafruit
    - "Adafruit Unified Sensor" by Adafruit  (dependency of BNO055 lib)
*/

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

// ── WiFi ──────────────────────────────────────────────────────────────────
const char* AP_SSID = "FingerTracker";
const char* AP_PASS = "";

// ── Flex sensors ──────────────────────────────────────────────────────────
const int   POT_PINS[5]     = {32, 33, 34, 35, 39};
const char* FINGER_NAMES[5] = {"thumb", "index", "middle", "ring", "pinky"};

int calMin[5] = {0,    0,    0,    0,    0   };
int calMax[5] = {4095, 4095, 4095, 4095, 4095};

// ── BNO055 ────────────────────────────────────────────────────────────────
// Default I2C address 0x28 (ADR pin tied to GND).
// Change to 0x29 if ADR pin is tied to 3.3V.
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28);
bool bnoAvailable = false;

// ── WebSocket ─────────────────────────────────────────────────────────────
WebSocketsServer webSocket(81);

// ── Smoothing ─────────────────────────────────────────────────────────────
const int SMOOTH_N = 8;
int rawBuffer[5][SMOOTH_N];
int bufIndex = 0;

unsigned long lastSend = 0;
const int SEND_INTERVAL_MS = 30;

// ─────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  // Init flex smoothing buffers
  for (int f = 0; f < 5; f++)
    for (int i = 0; i < SMOOTH_N; i++)
      rawBuffer[f][i] = 0;

  // Init BNO055
  Wire.begin(21, 22);   // SDA=21, SCL=22
  if (bno.begin()) {
    bno.setExtCrystalUse(true);   // use external crystal for better accuracy
    bnoAvailable = true;
    Serial.println("BNO055 initialised OK");
  } else {
    Serial.println("WARNING: BNO055 not found — check wiring (SDA=21, SCL=22, ADR->GND)");
  }

  // Start WiFi AP
  Serial.println("\nStarting Access Point...");
  WiFi.softAP(AP_SSID, AP_PASS);

  IPAddress ip = WiFi.softAPIP();
  Serial.println("──────────────────────────────────");
  Serial.printf("  Hotspot:   %s\n", AP_SSID);
  Serial.printf("  Password:  (none)\n");
  Serial.printf("  ESP32 IP:  %s\n", ip.toString().c_str());
  Serial.println("──────────────────────────────────");
  Serial.printf("WebSocket URL: ws://%s:81\n", ip.toString().c_str());
  Serial.println("──────────────────────────────────");

  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
  Serial.println("WebSocket server ready on port 81");
}

void loop() {
  webSocket.loop();

  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;
    sendFingerData();
  }
}

// ── Main broadcast ────────────────────────────────────────────────────────
void sendFingerData() {
  // --- Flex sensors ---
  float percent[5];
  for (int f = 0; f < 5; f++) {
    int raw = analogRead(POT_PINS[f]);
    rawBuffer[f][bufIndex % SMOOTH_N] = raw;

    long sum = 0;
    for (int i = 0; i < SMOOTH_N; i++) sum += rawBuffer[f][i];
    int smoothed = sum / SMOOTH_N;

    percent[f] = mapFloat(smoothed, calMin[f], calMax[f], 0.0, 100.0);
    percent[f] = constrain(percent[f], 0.0, 100.0);
  }
  bufIndex++;

  // --- BNO055 ---
  StaticJsonDocument<400> doc;

  for (int f = 0; f < 5; f++)
    doc[FINGER_NAMES[f]] = round(percent[f] * 10) / 10.0;

  if (bnoAvailable) {
    // Euler angles (heading / roll / pitch) in degrees
    sensors_event_t event;
    bno.getEvent(&event);

    JsonObject orientation = doc.createNestedObject("orientation");
    orientation["heading"] = round(event.orientation.x * 10) / 10.0;
    orientation["roll"]    = round(event.orientation.y * 10) / 10.0;
    orientation["pitch"]   = round(event.orientation.z * 10) / 10.0;

    // Quaternion (useful for 3-D rendering)
    imu::Quaternion quat = bno.getQuat();
    JsonObject q = doc.createNestedObject("quaternion");
    q["w"] = round(quat.w() * 1000) / 1000.0;
    q["x"] = round(quat.x() * 1000) / 1000.0;
    q["y"] = round(quat.y() * 1000) / 1000.0;
    q["z"] = round(quat.z() * 1000) / 1000.0;

    // Linear acceleration (gravity removed), m/s²
    imu::Vector<3> linAccel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
    JsonObject la = doc.createNestedObject("linearAccel");
    la["x"] = round(linAccel.x() * 100) / 100.0;
    la["y"] = round(linAccel.y() * 100) / 100.0;
    la["z"] = round(linAccel.z() * 100) / 100.0;

    // Calibration status (0=uncal … 3=fully cal)
    uint8_t sys, gyro, accel, mag;
    bno.getCalibration(&sys, &gyro, &accel, &mag);
    JsonObject cal = doc.createNestedObject("cal");
    cal["sys"]   = sys;
    cal["gyro"]  = gyro;
    cal["accel"] = accel;
    cal["mag"]   = mag;
  }

  doc["ts"] = millis();

  String json;
  serializeJson(doc, json);
  webSocket.broadcastTXT(json);
  Serial.println(json);
}

// ── WebSocket event handler ───────────────────────────────────────────────
void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_CONNECTED) {
    IPAddress ip = webSocket.remoteIP(num);
    Serial.printf("[WS] Client #%u connected from %s\n", num, ip.toString().c_str());
  } else if (type == WStype_DISCONNECTED) {
    Serial.printf("[WS] Client #%u disconnected\n", num);
  } else if (type == WStype_TEXT) {
    StaticJsonDocument<100> cmd;
    if (!deserializeJson(cmd, payload)) {
      if (cmd["cmd"] == "calibrate") {
        int f    = cmd["finger"];
        String t = cmd["type"].as<String>();
        int raw  = analogRead(POT_PINS[f]);
        if (t == "min") calMin[f] = raw;
        else             calMax[f] = raw;
        Serial.printf("Calibrated %s %s = %d\n", FINGER_NAMES[f], t.c_str(), raw);
      }
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
