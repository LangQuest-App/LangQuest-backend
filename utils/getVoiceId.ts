export default function getVoiceID(native_language:string){

    switch (native_language) {
        case "Italian":
            return "it-IT-giorgio";
        case "Hindi":
            return "hi-IN-rahul";
        case "English":
            return "en-IN-eashwar";
        case "Bengali":
            return "bn-IN-abhik";
        case "Tamil":
            return "ta-IN-iniya";
        default:
            return "";
    }
}