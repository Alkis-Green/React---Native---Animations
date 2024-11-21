import { StatusBar } from "expo-status-bar";
import ScrollToIndex from "./src/ScrollToIndex";
import SyncedFlatLists from "./src/SyncedFlatLists";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ScrollToIndex />
      {/* <SyncedFlatLists /> */}
    </>
  );
}
