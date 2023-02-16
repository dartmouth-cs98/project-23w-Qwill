
// this helper functions finds and returns the correct hosting address for the given user
export default function findIP() {
    const port = 8000;
    const address = "localhost";  // for simulators running on local CPU
    // const address = "10.0.2.2";  // for Android emulators running on local CPU
    return "http://" + address + ":" + port.toString();
};