import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Gif, SearchGifsResponse} from "../interfaces/gifs";

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = 'yV4EwO9QakSGzwBNiIsXjmfF7yzuAoPp';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _resultados: Gif[] = [];

  constructor(
    private http: HttpClient
  ) {
/*
    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!)
    }
*/
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this._resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  get historial() : string[] {
    return [...this._historial];
  }

  get resultados() {
    return [...this._resultados];
  }

  buscarGifs(query: string = '') : void {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this.historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe(res => {
        this._resultados = res.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })

  }
}
