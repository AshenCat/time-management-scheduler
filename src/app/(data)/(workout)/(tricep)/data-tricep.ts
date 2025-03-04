import PJR_PULL_OVER from "./PJR-pull-over.json";
import SKULL_CRUSHER from "./skull-crusher.json";
import UNILATERAL_TRICEP_KICKBACK from "./unilateral-tricep-kickback.json";

const DATA_TRICEP = {
    workouts: [
        PJR_PULL_OVER,
        SKULL_CRUSHER,
        UNILATERAL_TRICEP_KICKBACK,
    ] as DataMuscleGroupWorkout[],
    mediaURLs: [
        {
            url: "/static/images/workout/tricep/triceps-muscle.jpg",
            type: "image",
        },
    ] as MediaURL[],
    articles: [
        {
            title: "Tricep",
            text: "The tricep muscle, formally known as the triceps brachii, is a significant muscle located on the back of the upper arm. Here’s a detailed overview of this important muscle:\nKey Features of the Tricep Muscle:\nStructure:\nThe triceps brachii is a three-headed muscle, which means it has three points of origin:\nLong Head: Originates from the scapula.\nLateral Head: Originates from the humerus.\nMedial Head: Also originates from the humerus.\nFunction:\nThe primary function of the triceps is to extend the elbow, which means it helps straighten the arm. This action is crucial for various movements, including pushing and lifting.\nAppearance:\nWhen well-developed, the triceps can give the back of the arm a horseshoe shape, which is often sought after in strength training and bodybuilding.\nImportance in Exercise:\nThe triceps are heavily engaged in many upper body exercises, such as:\nPush-ups\nBench Press\nTricep Dips\nSkull Crushers\nStrengthening the triceps not only enhances arm aesthetics but also improves overall upper body strength and stability.\nBenefits of Strong Triceps:\nImproved Arm Strength: Essential for various daily activities and sports.\nEnhanced Performance: A strong tricep contributes to better performance in pushing movements.\nInjury Prevention: Strengthening the triceps can help stabilize the shoulder joint and reduce the risk of injuries.\nUnderstanding the tricep muscle is crucial for anyone looking to enhance their upper body strength and achieve well-defined arms",
            type: "text",
        },
    ] as Article[],
};

export default DATA_TRICEP;
