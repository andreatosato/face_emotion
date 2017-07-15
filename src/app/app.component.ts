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
  @ViewChild("imageCanvas") imageCanvas : any;
  private fileData: any;
  public ImageData: string;
  public ImageResult: Result[];
  private ctx: any;

  constructor(private http: Http) {
  }

  ngOnInit() {    
    this.ctx = this.imageCanvas.nativeElement.getContext("2d");
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file:File = inputValue.files[0]; 
    var arrayReader:FileReader = new FileReader();
    arrayReader.onloadend = function(e){
      this.fileData = arrayReader.result;
    }.bind(this);
    arrayReader.readAsArrayBuffer(file);

    var base64Reader:FileReader = new FileReader();
    base64Reader.onloadend = function(e) {      
      this.ImageData = base64Reader.result;
      let img = new Image();
      img.src= this.ImageData;
      img.onload = function(i){
        this.clearCanvas();
        this.imageCanvas.nativeElement.width = img.width;
        this.imageCanvas.nativeElement.height = img.height;
        this.ctx.drawImage(img, 0, 0, img.width, img.height);  
      }.bind(this);      
    }.bind(this);    
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
            result.forEach(iR => {
              iR.scores.anger = this.getPercentageValues(iR.scores.anger);
              iR.scores.contempt = this.getPercentageValues(iR.scores.contempt);
              iR.scores.disgust = this.getPercentageValues(iR.scores.disgust);
              iR.scores.fear = this.getPercentageValues(iR.scores.fear);
              iR.scores.happiness = this.getPercentageValues(iR.scores.happiness);
              iR.scores.neutral = this.getPercentageValues(iR.scores.neutral);
              iR.scores.sadness = this.getPercentageValues(iR.scores.sadness);
              iR.scores.surprise = this.getPercentageValues(iR.scores.surprise);

              this.ImageResult.push(iR);
              this.drawRectangle(iR);
            });           
          },
          err => {
            console.log(err.json())
          }
        );             
  }

  private getPercentageValues(value: number): number{
    if(value < 0.01)
      return 0;
    return value * 100;
  }

  private clearCanvas(){
    this.ctx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
  }

  private drawRectangle(iR: Result){
    this.ctx.beginPath();
    this.ctx.strokeStyle= 'red';
    this.ctx.lineWidth='2';
    this.ctx.rect(iR.faceRectangle.left, iR.faceRectangle.top, iR.faceRectangle.width, iR.faceRectangle.height);
    this.ctx.stroke();
  }
  private setResultValues(iR: Result){
      iR.scores.anger = this.getPercentageValues(iR.scores.anger);
      iR.scores.contempt = this.getPercentageValues(iR.scores.contempt);
      iR.scores.disgust = this.getPercentageValues(iR.scores.disgust);
      iR.scores.fear = this.getPercentageValues(iR.scores.fear);
      iR.scores.happiness = this.getPercentageValues(iR.scores.happiness);
      iR.scores.neutral = this.getPercentageValues(iR.scores.neutral);
      iR.scores.sadness = this.getPercentageValues(iR.scores.sadness);
      iR.scores.surprise = this.getPercentageValues(iR.scores.surprise);      
  }
}
