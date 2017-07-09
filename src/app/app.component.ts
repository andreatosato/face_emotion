import { Component, OnInit, ViewChild } from '@angular/core';
import { MdButtonModule, MdProgressSpinnerModule } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from "@angular/http";
import { Result } from "app/CognitiveServiceResult";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("fileInput") fileInput;
  @ViewChild("imageCanvas") imageCanvas : HTMLCanvasElement;
  private fileData: any;
  public ImageData: string;
  public ImageResult: Result[];

  constructor(private http: Http) {
  }

  ngOnInit() {    
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file:File = inputValue.files[0]; 
    var arrayReader:FileReader = new FileReader();
    var base64Reader:FileReader = new FileReader();

    arrayReader.onloadend = function(e){
      console.log(arrayReader.result);
      this.fileData = arrayReader.result;
    }.bind(this);
    base64Reader.onloadend = function(e) {
      this.ImageData = base64Reader.result;
      this.imageCanvas = new HTMLCanvasElement();
      let ctx = this.imageCanvas.getContext("2d");
      ctx.drawImage(this.ImageData, 0, 0, this.imageCanvas.width, this.imageCanvas.height);
    }.bind(this);

    arrayReader.readAsArrayBuffer(file);
    base64Reader.readAsDataURL(file);
  }

  checkFace(){
    
    let url = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";
    let h = new Headers();
    h.append('Ocp-Apim-Subscription-Key', 'b05b8ea4db3b4db08e799ba8c6cdc6f8');
    h.append('Content-Type', 'application/octet-stream');
    this.http.post(url, this.fileData, {headers: h})
        .subscribe(
          res => { 
            this.ImageResult = [];
            let result = res.json();
            result.forEach(imageResult => {
               if(imageResult.scores.anger < 0.01){
                imageResult.scores.anger = 0;
              } else{
                imageResult.scores.anger = imageResult.scores.anger * 100;
              }

              if(imageResult.scores.contempt < 0.01){
                imageResult.scores.contempt = 0;
              } else{
                imageResult.scores.contempt = imageResult.scores.contempt * 100;
              }

              if(imageResult.scores.disgust < 0.01){
                imageResult.scores.disgust = 0;
              } else{
                imageResult.scores.disgust = imageResult.scores.disgust * 100;
              }

              if(imageResult.scores.fear < 0.01){
                imageResult.scores.fear = 0;
              } else{
                imageResult.scores.fear = imageResult.scores.fear * 100;
              }

              if(imageResult.scores.happiness < 0.01){
                imageResult.scores.happiness = 0;
              } else{
                imageResult.scores.happiness = imageResult.scores.happiness * 100;
              }

              if(imageResult.scores.neutral < 0.01){
                imageResult.scores.neutral = 0;
              } else{
                imageResult.scores.neutral = imageResult.scores.neutral * 100;
              }

              if(imageResult.scores.sadness < 0.01){
                imageResult.scores.sadness = 0;
              } else{
                imageResult.scores.sadness = imageResult.scores.sadness * 100;
              }

              if(imageResult.scores.surprise < 0.01){
                imageResult.scores.surprise = 0;
              } else{
                imageResult.scores.surprise = imageResult.scores.surprise * 100;
              }

              this.ImageResult.push(imageResult);
            });           
          },
          err => {
            console.log(err.json())
          }
        );             
  }
}
