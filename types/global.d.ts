interface DataMuscleGroup {
    title: string;
    mediaURLs: MediaURL[];
    description: string;
    articles: Article[];
}

interface DataMuscleGroupWorkout {
    title: string;
    mediaURLs: MediaURL[];
    description: string;
    articles: Article[];
    urlParam: string;
    resources?: string[];
}

interface Article {
    title: string;
    text?: string;
    list?: string[];
    type: "text" | "list";
}

interface MediaURL {
    url: string;
    type: "image" | "video";
}
