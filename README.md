# magicmirror
## A Magic-mirror powered by Home Assistants´ Javascript API

- [magicmirror](#magicmirror)
  - [A Magic-mirror powered by Home Assistants´ Javascript API](#a-magic-mirror-powered-by-home-assistants%C2%B4-javascript-api)
  - [Functions](#functions)
  - [Configuration options](#configuration-options)
      - [Public Transport](#public-transport)
      - [Media Players](#media-players)
      - [Weather](#weather)
      - [News](#news)


***
## Functions

| Feature 	          | Description 	| Supported 	| Known supported HA version 	|   	
|---------	          |-------------	|-------	|------------------------	|
| Display media_player| Displays the current song, artist, album and media image. |V.0.1 Not supported	|V.0.87.0 	|
| Display weather | Displays the current weather based from a weather entitiy.	| V.0.1 Not supported 	|  V.0.87.0	|  
| Display bus/tram/train depatures | Displays the next two depatures based upon two entities where the state of them are the time of the next depature.  	|   V.0.1+  |   V.0.89.2 	| 
| Display greetings | A greeting being displayed in the center of the mirror. | V.0.1 Not supported|  |
| Display the current time | Displays the current time and date | V.0.1 Not supported| |
***
## Configuration options
#### Public Transport
``` 
publicTransport:
  - line: XXXX                  - Required
    alias: XXXX                 - Required
    entities:                   - Required
    - sensor.towards_town       - Required
    - sensor.towards_town_after - Optional
```
#### Media Players
```
mediaPlayer:
  entities:                     - Required
  - media_player.smart_speaker  - Required
```
#### Weather
```
weather:
  entity: weather.smhi_home     - Required
```
#### News
```
newsapi:
  apiKey: XXXX                  - Required
```