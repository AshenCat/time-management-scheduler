import ALT_BICEP_CURL from "./alt-bicep-curl.json";
import ALT_HAMMER_CURL from "./alt-hammer-curl.json";
import CURL_NEGATIVES from "./curl-negatives.json";

const DATA_BICEP = {
    workouts: [
        ALT_BICEP_CURL,
        ALT_HAMMER_CURL,
        CURL_NEGATIVES,
    ] as DataMuscleGroupWorkout[],
    mediaURLs: [
        {
            url: "/static/images/workout/bicep/bicep-tendons-muscles.jpg",
            type: "image",
        },
    ] as MediaURL[],
    articles: [
        {
            title: "Bicep",
            text: "The biceps, also known as the biceps brachii, is a muscle in the upper arm that flexes the elbow and rotates the forearm. The long head crosses the shoulder and elbow joints",
            type: "text",
        },
        {
            title: "Anatomy",
            text: "The biceps is a large, thick muscle that runs from the shoulder to the elbow which has two heads, a long head and a short head. The long head crosses the shoulder and elbow joints while the shorthead is located in the upper arm.",
            type: "text",
        },
        {
            title: "Function",
            list: [
                "The biceps flexes the forearm when extended",
                "The biceps supinates the forearm when flexed",
                "The biceps is used when opening a bottle with a corkscrew",
            ],
            type: "list",
        },
    ] as Article[],
};

export default DATA_BICEP;
