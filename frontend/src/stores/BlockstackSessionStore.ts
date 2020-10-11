import { UserSession } from "blockstack";
import { useRef } from "react";
import { appConfig } from "src/utils/constants";
import { useStore } from "simstate";

const session = new UserSession({ appConfig });

export function BlockstackSessionStore() {
  return useRef(session).current;
}

export function useBSSession() {
  return useStore(BlockstackSessionStore);
}
