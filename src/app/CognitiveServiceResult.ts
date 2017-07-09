 export class FaceRectangle {
    left: number;
    top: number;
    width: number;
    height: number;
}

export class Scores {
    anger: number = 0;
    contempt: number = 0;
    disgust: number = 0;
    fear: number = 0;
    happiness: number = 0;
    neutral: number = 0;
    sadness: number = 0;
    surprise: number = 0;
}

export class Result {
    faceRectangle: FaceRectangle = new FaceRectangle();
    scores: Scores = new Scores();
}