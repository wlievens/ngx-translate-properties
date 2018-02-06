import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {TranslateLoader} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PropertiesHttpLoader extends TranslateLoader {
  constructor(protected httpClient: HttpClient,
              protected prefix: string,
              protected suffix: string) {
    super();
  }

  getTranslation(lang: string): Observable<any> {
    const url = `${this.prefix}${lang}${this.suffix}`;
    return this.httpClient.get(url, {responseType: 'text'})
      .map(text => this.parse(text));
  }

  private parse(content: string): any {
    const result = {};
    content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.startsWith('#'))
      .map(line => {
        const index: number = line.indexOf('=');
        if (index < 0) {
          return null;
        }
        const key = line.substr(0, index).trim();
        let value = line.substr(index + 1).trim();
        value = value.replace(/\\:/, ':');
        value = value.replace(/\\!/, '!');
        return [key, value];
      })
      .filter(entry => entry != null)
      .forEach(entry => {
        result[entry[0]] = entry[1];
      });
    return result;
  }
}
