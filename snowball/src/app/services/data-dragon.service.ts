import { EventEmitter, Injectable, Output } from '@angular/core';
import { Champion, Champions } from '../../model/champion';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataDragonService {
  champions: Champion[] = [];
  version: string | undefined;

  localAppDataPath = '';

  @Output() championsEvent: EventEmitter<Champion[]> = new EventEmitter();

  http!: HttpClient;

  constructor() {}

  public setHttpClient(httpClient: HttpClient) {
    this.http = httpClient;
    return this;
  }

  public updateDD() {
    overwolf.extensions.current.getManifest((appManifest) => {
      this.localAppDataPath = `/overwolf/extensions/${appManifest.UID}/${appManifest.meta.version}`;
      overwolf.io.fileExists(
        overwolf.io.paths.localAppData +
          this.localAppDataPath +
          '/dd/champions.json',
        (exists) => {
          this.http
            .get<string[]>(
              'https://ddragon.leagueoflegends.com/api/versions.json'
            )
            .subscribe((versions) => {
              if (versions) {
                this.version = versions.at(0) ?? '14.5.1';
                if (exists.found) {
                  overwolf.io.readFileContents(
                    overwolf.io.paths.localAppData +
                    this.localAppDataPath +
                    '/dd/champions.json',
                    overwolf.io.enums.eEncoding.UTF8,
                    (data) => {
                      if (data.content) {
                        let champions = JSON.parse(data.content) as Champions;
                        if (champions.version == this.version) {
                          this.champions = Array.from(
                            new Map<string, Champion>(
                              Object.entries(champions.data)
                            ).values()
                          );
                        } else if (this.version) {
                          this.readFromDD(this.version);
                        }
                      }
                    }
                  );
                } else {
                  this.readFromDD(this.version);
                }
              }
            });
        }
      );
    });
  }

  private readFromDD(version: string) {
    this.http
      .get<Champions>(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
      )
      .subscribe((data) => {
        if (data) {
          this.champions = Array.from(
            new Map<string, Champion>(Object.entries(data.data)).values()
          );
          overwolf.io.writeFileContents(
            overwolf.io.paths.localAppData +
              this.localAppDataPath +
              '/dd/champions.json',
            JSON.stringify(data),
            overwolf.io.enums.eEncoding.UTF8,
            false,
            () => {}
          );
        }
      });
  }
}
