/*
  Finger Extension Tracker - ESP32 Firmware (Access Point Mode)
  ==============================================================
  Hotspot name:     FingerTracker
  Hotspot password: (none)
  Dashboard URL:    ws://192.168.4.1:81

  Pinout:
    Thumb  -> GPIO32
    Index  -> GPIO33
    Middle -> GPIO34
    Ring   -> GPIO35
    Pinky  -> GPIO39

  Each pot: Left leg -> GND | Wiper -> GPIO | Right leg -> 3.3V

  Libraries needed (Arduino Library Manager):
    - "WebSockets" by Markus Sattler
    - "ArduinoJson" by Benoit Blanchon
*/

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

const char* AP_SSID = "FingerTracker";
const char* AP_PASS = "";

const int   POT_PINS[5]     = {32, 33, 34, 35, 39};
const char* FINGER_NAMES[5] = {"thumb", "index", "middle", "ring", "pinky"};

int calMin[5] = {0,    0,    0,    0,    0   };
int calMax[5] = {4095, 4095, 4095, 4095, 4095};

WebSocketsServer webSocket(81);

const int SMOOTH_N = 8;
int rawBuffer[5][SMOOTH_N];
int bufIndex = 0;

unsigned long lastSend = 0;
const int SEND_INTERVAL_MS = 30;

void setup() {
  Serial.begin(115200);
  delay(500);

  for (int f = 0; f < 5; f++)
    for (int i = 0; i < SMOOTH_N; i++)
      rawBuffer[f][i] = 0;

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

void sendFingerData() {
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

  StaticJsonDocument<200> doc;
  for (int f = 0; f < 5; f++)
    doc[FINGER_NAMES[f]] = round(percent[f] * 10) / 10.0;
  doc["ts"] = millis();

  String json;
  serializeJson(doc, json);
  webSocket.broadcastTXT(json);
  Serial.println(json);
}

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

float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}