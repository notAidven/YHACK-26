import { createContext, useContext } from 'react';

export const WsContext = createContext<(obj: object) => void>(() => {});
export const useWsSend = () => useContext(WsContext);
