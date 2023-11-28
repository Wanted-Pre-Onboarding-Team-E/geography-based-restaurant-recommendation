![geography-base-restaurant-recommendation](https://github.com/Wanted-Pre-Onboarding-Team-E/geography-based-restaurant-recommendation/assets/68440583/9c848047-be3f-4827-9b14-bccf398b6022)

# :sushi: 여기가자

## :hash: 프로젝트 소개

본 서비스는 `공공 데이터`를 활용하여, `지역 음식점 목록`을 자동으로 업데이트 합니다.<br>
이를 통해 `사용자 위치 기반`의 `맛집 리스트`를 제공하고 맛집들의 `메뉴를 추천`합니다.<br>
더불어 맛집에 대한 `평가`를 등록하여 음식을 좋아하는 사람들 간의 소통을 할 수 있는 서비스입니다.

<br>

## 🛠️ 기술 스택

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-FCAD03?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjMzIiB2aWV3Qm94PSIwIDAgMjU2IDIzMyI+CiAgICA8cGF0aCBmaWxsPSIjMzMzMzMzIgogICAgICAgICAgZD0iTTEzOC42MyAzMi4yMzJhNS42NjUgNS42NjUgMCAwIDEgNS42NjMgNS41MjFsLjAwMi4xNDR2NjQuODQ1YTUuNjY1IDUuNjY1IDAgMCAxLTUuNTIxIDUuNjY0bC0uMTQ0LjAwMkg4NS43NTRhNS42NjUgNS42NjUgMCAwIDEtNS42NjQtNS41MjJsLS4wMDEtLjE0NFYzNy44OTdhNS42NjcgNS42NjcgMCAwIDEgNS41MjEtNS42NjRsLjE0NC0uMDAxaDUyLjg3NlptMCAyLjUySDg1Ljc1NGEzLjE1IDMuMTUgMCAwIDAtMy4xNDcgMy4wMzJsLS4wMDMuMTEzdjY0Ljg0NWEzLjE1NSAzLjE1NSAwIDAgMCAzLjAzNyAzLjE0OGwuMTEzLjAwMmg1Mi44NzZhMy4xNTUgMy4xNTUgMCAwIDAgMy4xNDctMy4wMzdsLjAwMi0uMTEzVjM3Ljg5N2EzLjE1IDMuMTUgMCAwIDAtMy4xNS0zLjE0NVpNOTMuMzA2IDkyLjY3djMuNzc0aC0zLjc3OFY5Mi42N2gzLjc3OFptNDIuMTggMHYzLjc3NEg5NS4xOTdWOTIuNjdoNDAuMjg3Wm0tNDIuMTgtMTYuMzY3djMuNzc0aC0zLjc3OHYtMy43NzRoMy43NzhabTQyLjE4IDB2My43NzRIOTUuMTk3di0zLjc3NGg0MC4yODdabS00Mi4xOC0xNS43Mzh2My43NzNoLTMuNzc4di0zLjc3M2gzLjc3OFptNDIuMTggMHYzLjc3M0g5NS4xOTd2LTMuNzczaDQwLjI4N1ptMC0xNC40OHYzLjc3OEg4OS41Mjd2LTMuNzc5aDQ1Ljk1N1ptMy4xNDQgNzUuNTM1di4wNGE1LjY2NSA1LjY2NSAwIDAgMSA1LjY2MyA1LjQ4M2wuMDAyLjE0M3Y2NC44NDVhNS42NjUgNS42NjUgMCAwIDEtNS41MjEgNS42NjRsLS4xNDQuMDAySDg1Ljc1NGE1LjY2NSA1LjY2NSAwIDAgMS01LjY2My01LjQ5M2wtLjAwMi0uMTczdi02NC44NDVhNS42NjcgNS42NjcgMCAwIDEgNS41MjEtNS42NjRsLjE0NC0uMDAxaDUyLjg3NlptMCAyLjUyMUg4NS43NTRhMy4xNSAzLjE1IDAgMCAwLTMuMTQ3IDMuMDMybC0uMDAzLjExM3Y2NC44NDVhMy4xNTUgMy4xNTUgMCAwIDAgMy4wMzcgMy4xNDhsLjExMy4wMDJoNTIuODc2YTMuMTU1IDMuMTU1IDAgMCAwIDMuMTQ3LTMuMDE4bC4wMDItLjExMnYtNjQuODQ1YTMuMTUgMy4xNSAwIDAgMC0zLjAzNi0zLjE0M2wtLjExMy0uMDAydi0uMDJabS00NS4zMjQgNTcuOTMydjMuNzc5aC0zLjc3OHYtMy43NzloMy43NzhabTQyLjE4LjAzdjMuNzJIOTUuMTk3di0zLjcyaDQwLjI4N1ptLTQyLjE4LTE2LjM5N3YzLjc3OGgtMy43Nzh2LTMuNzc4aDMuNzc4Wm00Mi4xOC4wMjl2My43Mkg5NS4xOTd2LTMuNzJoNDAuMjg3Wm0tNDIuMTgtMTUuNzYzdjMuNzc0aC0zLjc3OHYtMy43NzRoMy43NzhabTQyLjE4LjAzdjMuNzE1SDk1LjE5N1YxNTBoNDAuMjg3Wm0wLTE0LjUxdjMuNzc4SDg5LjUyN3YtMy43NzhoNDUuOTU3Wm0xOC4zOTMtNjUuMTcydjMuMTQ0aDE4Ljg4M3Y4NS41MzFoLTE4Ljg4M3YzLjE0OWgyMi4wMzJWNzAuMzJoLTMuMTQ5eiBNMTkuMzMyIDE0Ljc5NWMzLjcyMy02LjEwNyA5Ljg1Ny05LjY2OSAxNi4wNTMtMTEuNzM3bC44NDUtLjI3M2wuODQ0LS4yNTVjLjQyMi0uMTIzLjg0My0uMjQgMS4yNjMtLjM1bC44MzctLjIxM2MuMTQtLjAzNC4yNzktLjA2OC40MTctLjFsLjgzLS4xOWwuNDExLS4wODlsLjgxOC0uMTY3bC44MDktLjE1MmwuNzk4LS4xNGwuNzg3LS4xMjZsLjc3My0uMTE1bC43NTktLjEwMmwuNzQzLS4wOTFsLjcyNi0uMDgxbC43MDgtLjA3MWwxLjAyNC0uMDlsLjk3NS0uMDdsLjkyMi0uMDUybDEuMDAyLS4wNDNsLjkxNy0uMDI2bC41Ni0uMDA5bC41MTYtLjAwNGguNDcxbC42MTcuMDA4bC4zNDguMDA3bC42MzUuMDIybC4yOC4wMTR2MTUuMTE0Yy0xMy4zNjgtMS4yNzItMTkuMzMzIDIuNzY2LTIxLjk2MyA3LjA2OWwtLjIzNy40MDRhMTMuMjYzIDEzLjI2MyAwIDAgMC0uODQ1IDEuODEzbC0uMTQyLjM5NmMtLjAyMy4wNjUtLjA0NS4xMy0uMDY2LjE5NmwtLjEyMS4zOWwtLjEwOC4zODNsLS4wOTQuMzc2Yy0uMDE1LjA2Mi0uMDMuMTI0LS4wNDMuMTg1bC0uMDc3LjM2NWwtLjAzNC4xOGwtLjA2LjM1bC0uMDUyLjM0bC0uMDQxLjMyOWwtLjA0Ny40N2wtLjAzMS40MzlsLS4wMTUuMzQ0bC0uMDA3LjMxOXYuMjlsLjAwNS4yNmwuMDEuMjNsLjAxNy4yOGwuMDMyLjMzdjUuNTUzbC0uMDMzIDExLjMzN2wtLjA0IDguMTdsLS4wNDYgNi44NzJsLS4wNSA1LjgwN2wtLjA1IDQuNTczbC0uMDU4IDQuNDUybC0uMDYgMy43OTVsLS4wNzYgNC4wMjFsLS4wNDcgMi4wOTVsLS4wNTEgMS45OGwtLjA2NiAyLjIwNWwtLjAyMy42OWwtLjAwMiAxLjI3NmwtLjAwNy43ODFsLS4wMDkuNTI4bC0uMDIuNzk4bC0uMDMyLjc3MmwtLjAyNi40N2wtLjAzLjQ3MmwtLjAzOC40NzRsLS4wNjguNzEybC0uMDU0LjQ3NmwtLjA2My40NzdsLS4wNzEuNDc3bC0uMDM5LjIzOGwtLjA4NS40NzZsLS4wNDYuMjM4bC0uMS40NzVsLS4xMS40NzRsLS4xMjEuNDczYy0uMDQzLjE1Ny0uMDg3LjMxNC0uMTM0LjQ3bC0uMTQ2LjQ3bC0uMTU4LjQ2NWwtLjE3Mi40NjNjLTEuOTM2IDUuMDAzLTYuMzIgOS40NTgtMTYuMjQ1IDExLjUyMWM5LjY1NiAyLjAwNSAxNC4wNjcgNi4yNyAxNi4wODIgMTEuMWwuMTg0LjQ2MmMuMTc4LjQ2NC4zMzUuOTMyLjQ3MyAxLjQwM2wuMTMzLjQ3MmMuMDg0LjMxNS4xNi42MzIuMjMuOTVsLjA5OC40NzZsLjA0NS4yMzlsLjA4NC40NzdsLjA3NS40NzhsLjA2NS40NzhsLjA1OC40NzhsLjA1LjQ3N2wuMDQyLjQ3NmwuMDM2LjQ3NWwuMDQzLjcwOWwuMDIyLjQ3bC4wMjcuNzg4bC4wMTIuNTJsLjAwOS41MTdsLjAwNi43NjVsLjAwMiAxLjI3bC4wNjggMi4yMTRsLjA2IDIuMzM4bC4wNTYgMi41MDZsLjA1IDIuNjU0bC4wNTUgMy4yNTRsLjA3NCA1LjM3NWwuMDUgNC41NTVsLjAyNiAyLjU2MmwuMDUzIDYuNTQ2bC4wNTggOS43MTJsLjA0IDEwLjUxMWwuMDE1LS4wMDl2OS4zMjNsLS4wMTUuMTMybC0uMDE4LjE5OGwtLjAxMS4xNzhsLS4wMTUuMzMxbC0uMDA1LjI2MXYuMjlsLjAwNy4zMTlsLjAxNS4zNDRsLjAzLjQzNGwuMDI5LjMwNWwuMDU4LjQ4MmwuMDUuMzM2bC4wNTkuMzQ1bC4wNy4zNTVsLjAzOC4xOGwuMDg2LjM2OGwuMDQ4LjE4NmwuMTA0LjM3OGwuMTE4LjM4M2MuMDIuMDY1LjA0Mi4xMy4wNjQuMTk0bC4xMzkuMzljLjA0OC4xMzEuMS4yNjMuMTUzLjM5NWwuMTcuMzk2YzIuMSA0LjcwOCA3LjYzNyA5Ljc5MyAyMS45NiA4LjYyN2wuNzg1LS4wN3YxNS4xMTVsLS40MDEuMDJsLS43NDQuMDIxbC0uNjEyLjAxaC0uNzI3bC0uNTQ1LS4wMDVsLS41OS0uMDEybC0uNjMyLS4wMThsLS44MjItLjAzM2wtLjU4LS4wMjlsLS42MDItLjAzNmwtLjYyNi0uMDQzbC0uNjQ2LS4wNWwtLjY2Ni0uMDZsLS42ODUtLjA2N2wtLjcwMy0uMDc3bC0uNzE5LS4wODdsLS43MzQtLjA5N2E2Mi40NzggNjIuNDc4IDAgMCAxLS4zNzItLjA1M2wtLjc1NC0uMTE0bC0uMzgyLS4wNmwtLjc3Mi0uMTMyYTU4LjU4IDU4LjU4IDAgMCAxLS4zOS0uMDdsLS43ODctLjE1MmE1Ni40MjIgNTYuNDIyIDAgMCAxLS4zOTctLjA4bC0uOC0uMTdsLS44MDUtLjE4NmMtLjI3LS4wNjQtLjU0LS4xMy0uODExLS4ybC0uODE2LS4yMTVjLTcuNDktMi4wNDItMTUuMzYtNi4wNzgtMTkuNDA3LTEzLjk4N2MuODc4LTkuNzIyIDQuODc2LTE4LjAxIDEyLjA1Ny0yMy4xNjljLjMzOC0uMjM4LjY4LS40NyAxLjAyNy0uNjkzbC4zOTItLjI0OWMtLjQ4Ni4zLS45NjQuNjE4LTEuNDMzLjk1MmMtNy4xNjcgNS4xNDktMTEuMTY1IDEzLjQzNy0xMi4wNDMgMjMuMTJhMjYuNTY3IDI2LjU2NyAwIDAgMS0yLjc2LTExLjcwMWwtLjA5LTQuMTY3bC0uMTE3LTUuMDUybC0uMTQ2LTUuOTEybC0uMi03LjUzNmwtLjE4Mi02LjUzNmwtLjI1Mi04LjU1N2wtLjI4NC05LjE2NmwtLjQ3Ni0xNC40MjRsLS4xMTUtMy4zNDVjLS4yODEtNy41NzItMy4zMi0xMS4yNi02LjQ4My0xMy4wNGwtLjM3My0uMjAxYTExLjY5OCAxMS42OTggMCAwIDAtLjE4Ni0uMDk0bC0uMzczLS4xNzZhMTIuOTcgMTIuOTcgMCAwIDAtLjM3MS0uMTZsLS4zNjktLjE0NGE4Ljg5NSA4Ljg5NSAwIDAgMC0uMzY2LS4xM2wtLjM2Mi0uMTE4Yy0uMTItLjAzNi0uMjM4LS4wNy0uMzU2LS4xMDNsLS4yODMtLjA3NWwtLjI3OC0uMDY3bC0uMjc0LS4wNmwtLjI2OC0uMDUzbC0uMzkxLS4wNjhsLS4yNTMtLjAzN2wtLjI0NS0uMDMybC0uMzUzLS4wMzlsLS4zMTItLjAwMmwtLjYzNy0uMDA3YTMzLjI0MyAzMy4yNDMgMCAwIDAtLjk5OCAwbC0uMzQ1LjAwOXYtMTcuNzEzYy44MjkuMDMgMS41Ny4wMTUgMi4yOTItLjAyNGwuMzUzLS4wNGwuMjQ1LS4wMzFsLjI1My0uMDM4bC4zOTEtLjA2OGwuMjY4LS4wNTNsLjI3NC0uMDZsLjI3OC0uMDY3bC4yODMtLjA3NGwuMzU2LS4xMDRsLjM2Mi0uMTE3bC4zNjYtLjEzYzMuNjc2LTEuMzc1IDcuODI0LTQuOTA4IDguMTU1LTEzLjgxNmwuNDMtMTIuODFsLjMzMy0xMC40NjRsLjE4LTUuOTM4bC4yNzYtOS41MjZsLjE4LTYuNjI2bC4xMzEtNS4wNDdsLjE2NS02Ljc1N2wuMDk2LTQuMmwuMDcxLTMuMzMxYy4xMS01LjI0OSAxLjQwNC05LjUxIDMuNDU3LTEyLjk2OGwuMTM4LS4yMjlsLS4wMDEtLjAxMVptMTgwLjY0My4zN1YuMDUybC40MDYtLjAybC41NjQtLjAxN2wuMzY2LS4wMDdsLjY0Ni0uMDA3aC40OTNsLjU0LjAwNmwuODMyLjAxN2wxLjA2My4wMzhsLjU2OS4wMjdsLjU5Mi4wMzRsLjkzMS4wNjNsLjY0Ny4wNTJsLjY2Ni4wNmwuNjg1LjA3bC43MDEuMDc4bC43MTguMDg4bC43MzIuMDk4bC43NDYuMTFsLjc1OS4xMmwuMzgzLjA2NWwuNzc1LjEzOWwuNzg0LjE1MmwuNzkyLjE2NGwuOC4xOGwuODA0LjE5MmMuNDA0LjEuODEuMjA3IDEuMjE2LjMxOGwuODE0LjIzMmM3LjYxIDIuMjM1IDE1LjQzMyA2LjU5MiAxOS4xMDggMTUuMDI3YTI3LjE1NyAyNy4xNTcgMCAwIDEgMi4xNTUgMTAuNDJsLjA5IDQuMTY3bC4xMTcgNS4wNTJsLjA4MiAzLjM4bC4xMyA1LjA2bC4xNzkgNi42NjNsLjEzNyA0Ljg4NGwuMjUyIDguNTU4bC4yODQgOS4xNjZsLjQ3NiAxNC40MjRsLjExNSAzLjM0NWMuMjg2IDcuNjk4IDMuNDIyIDExLjM4IDYuNjQxIDEzLjEyNWwuMzcyLjE5M2wuMTg2LjA5bC4zNy4xN2wuMzcuMTUyYy4wNjEuMDI1LjEyMy4wNDguMTg0LjA3MWwuMzY1LjEzMmwuMTgxLjA2bC4zNTkuMTExbC4xNzcuMDUxbC41MjYuMTM1bC4zNDMuMDc3bC4zMzQuMDY1bC4zMjUuMDU2bC4yNTMuMDM4bC4yNDUuMDMybC4zNTMuMDM5Yy42MTkuMDMzIDEuMjYzLjA0OSAxLjk0Ny4wMzRsLjM0NS0uMDF2MTcuNzE4YTI1LjMwNCAyNS4zMDQgMCAwIDAtMi4yOTIuMDI1bC0uMjMzLjAyNGwtLjI0Mi4wM2wtLjM3Ni4wNTRsLS4zOTEuMDY4bC0uMjY4LjA1M2wtLjI3NC4wNmwtLjI3OC4wNjdsLS4yODMuMDc0bC0uMTc3LjA1bC0uMzYuMTFsLS4xODEuMDZsLS4zNjYuMTMxYTEyLjM5IDEyLjM5IDAgMCAwLS4xODQuMDdsLS4zNy4xNTNjLTMuNTI3IDEuNTE5LTcuMjg3IDUuMTMtNy42IDEzLjU5M2wtLjQzMiAxMi44MDNsLS4zMzIgMTAuNDY1bC0uMTggNS45MzlsLS4yNzYgOS41MjdsLS4xOCA2LjYyNmwtLjEzMSA1LjA0N2wtLjE2NSA2Ljc1N2wtLjA5NiA0LjJsLS4wNzEgMy4zM2EyNy42OTMgMjcuNjkzIDAgMCAxLTEuNjM2IDkuMTMzbC0uMTI2LjM0M2wuMDA2LjAzMmMtMy43NjggOS43MzUtMTIuODg2IDE0LjMxMi0yMS4zMDQgMTYuNDQybC0uODI2LjIwMmwtLjQxLjA5NWwtLjgxNy4xOGwtLjQwNS4wODNsLS44MDQuMTU4bC0uMzk5LjA3NGwtLjc5LjEzOGwtLjM5LjA2NGwtLjc3Mi4xMmwtLjc1OC4xMDdsLS43NDMuMDk2bC0uNzI4LjA4NWwtLjcxLjA3NmwtLjY5MS4wNjZsLTEgLjA4MmwtLjY0LjA0NWwtLjkxNS4wNTRsLS44Ni4wMzhsLTEuMDUuMDMybC0uNTk4LjAxbC0uNTUuMDA0aC0uNDk4bC0uNDQ1LS4wMDVsLS4zODgtLjAwN2wtLjQ3My0uMDE0bC0uNDEtLjAxN2wtLjE0My0uMDA4di0xNS4xMTRjMTMuOTk1IDEuMzMyIDE5Ljg3Ni0zLjE1NiAyMi4zMTItNy42NzVsLjIxLS40MDVjLjA2Ni0uMTM0LjEzLS4yNy4xOS0uNDA0bC4xNzUtLjQwMmMuMDU1LS4xMzMuMTA4LS4yNjcuMTU4LS40bC4xNDMtLjM5NWwuMTI4LS4zOTJsLjA1OS0uMTk0bC4xMDgtLjM4M2wuMDk0LS4zNzdsLjA4My0uMzY5bC4wNzEtLjM2bC4wNi0uMzVsLjA1MS0uMzRsLjA0Mi0uMzNsLjA0Ny0uNDdsLjAyMi0uMjk2bC4wMjQtLjQ4N2wuMDA3LS4zMTh2LS4yOWwtLjAwNS0uMjYybC0uMDEtLjIyOWwtLjAxLS4xOTVsLS4wMjQtLjI4M2wtLjAxNS0uMTMydi04LjI4OWwuMDIzLTcuNzE3bC4wMzgtNy45NjNsLjA0NS02LjcxMWwuMDU5LTYuODUxbC4wNjgtNi4xNDlsLjA0OC0zLjU3NWwuMDQ1LTIuODc5bC4wNi0zLjMwMmwuMDQyLTIuMDlsLjA0Ny0xLjk4OGwuMDQ5LTEuODc1bC4wNjYtMi4xNjZsLjAwMi0xLjI3bC4wMDctLjc3NGwuMDA4LS41MjJsLjAxMy0uNTI2bC4wMjgtLjc5NmwuMDI2LS41MzRsLjAyOS0uNDc2bC4wMzUtLjQ3N2wuMDQtLjQ3OWwuMDUtLjQ4bC4wNTUtLjQ4bC4wNjQtLjQ4MmwuMDM2LS4yNGwuMDc3LS40ODFsLjA4Ny0uNDhsLjA5Ny0uNDhsLjEwOC0uNDhjLjEzMi0uNTU3LjI4Ny0xLjExMi40NjgtMS42NjJsLjE2My0uNDdjLjIyNi0uNjI0LjQ4OC0xLjI0Ljc5My0xLjg0NmwuMjM2LS40NTJjMi4yODYtNC4xOTggNi43MjYtNy44IDE1LjM1NC05LjU5NGMtMTAuODgyLTIuMjU5LTE1LjEwMi03LjM4Ny0xNi43NC0xMi45NjFsLS4xMzItLjQ3MmMtLjA4NC0uMzE1LS4xNi0uNjMyLS4yMy0uOTVsLS4wOTgtLjQ3NmwtLjA0NS0uMjM4bC0uMDg0LS40NzhsLS4wNzUtLjQ3OGwtLjA2NS0uNDc4bC0uMDU4LS40NzdsLS4wNS0uNDc3bC0uMDQyLS40NzZsLS4wMzYtLjQ3NWwtLjA0My0uNzA5bC0uMDIyLS40N2wtLjAyNy0uNzg4bC0uMDEyLS41MmwtLjAwOS0uNTE2bC0uMDA2LS43NjZsLS4wMDItMS4yN2wtLjA0Ny0xLjQ3N2wtLjA1MS0xLjg3OGwtLjA1OC0yLjQxN2wtLjA1My0yLjU3NGwtLjA1LTIuNzFsLS4wNTgtMy43ODdsLS4wNjktNS40NDZsLS4wNTItNS4wODlsLS4wNDgtNS44OTVsLS4wNjMtMTAuNDgzbC0uMDQxLTExLjM2Yy44Ni0uNDc0IDEuNjkzLS45OTUgMi40OTYtMS41NmM0LjAwNC0yLjg2OCA3LjAyLTYuNzM0IDkuMDUzLTExLjI4MmwuMTQtLjMxOGMtMi4wMzYgNC42ODYtNS4xIDguNjY3LTkuMjA3IDExLjYwNmMtLjY3LjQ3LTEuMzYuOTEtMi4wNyAxLjMxOWwtLjQyNy4yNHYtOC40MzRsLjAxNS0uMTMybC4wMTgtLjE5OWwuMDExLS4xNzhsLjAxNS0uMzNsLjAwNS0uMjYxdi0uMjlsLS4wMDctLjMybC0uMDE1LS4zNDRsLS4wMTgtLjI4NWwtLjA0LS40NTRsLS4wNTktLjQ4MmwtLjA1LS4zMzVsLS4wNTktLjM0NmwtLjA3LS4zNTVhMTQuODggMTQuODggMCAwIDAtLjAzOC0uMThsLS4wODYtLjM2N2ExNC41NjMgMTQuNTYzIDAgMCAwLS4wNDgtLjE4N2wtLjEwNC0uMzc4bC0uMTE4LS4zODNjLS4wMi0uMDY0LS4wNDItLjEyOS0uMDY0LS4xOTRsLS4xMzktLjM5Yy0uMDQ4LS4xMy0uMS0uMjYyLS4xNTMtLjM5NGwtLjE3LS4zOTdjLTIuMS00LjcwNy03LjYzNy05Ljc5Mi0yMS45Ni04LjYyN2wtLjc4NS4wN1oiLz4KPC9zdmc+">
&nbsp;
<img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/Redis-DC382C?style=for-the-badge&logo=redis&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">

<br>

## 🏷️ 목차

1. [:gear: 환경 설정 및 실행](#gear-환경-설정-및-실행)
2. [:cd: 데이터베이스 모델링](#cd-데이터베이스-모델링)
3. [:earth_asia: API 명세](#earth_asia-API-명세)
4. [:bookmark_tabs: 구현 내용](#bookmark_tabs-구현-내용)
5. [:wave: 팀원 소개](#wave-팀원-소개)

<br>

## :gear: 환경 설정 및 실행

데이터베이스 스키마를 생성합니다.

```sql
CREATE DATABASE `wanted`
    DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

서버 및 데이터베이스 연결을 위한 환경 변수를 설정합니다.

```dotenv
SERVER_PORT=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
OPEN_API_KEY=
DISCORD_WEBHOOK_URL=
```

데이터베이스 스키마 생성 후, 스크립트 파일 실행으로 초기 설정합니다.

```bash
> sh start.sh # 리눅스 스크립트 파일 실행
> ./start.bat # 윈도우 스크립트 파일 실행
```

<br>

## :cd: 데이터베이스 모델링

- 사용자 ↔️ 평가 `1:N`
    - 하나의 사용자가 여러 개의 평가를 등록할 수 있습니다.
- 맛집 ↔️ 평가 `1:N`
    - 하나의 맛집에 여러 개의 평가를 등록할 수 있습니다.

![image.png](https://hackmd.io/_uploads/S1j4QjDmT.png)

<br>

## :earth_asia: API 명세

> [`GitHub Wiki`로 이동! 🏃🏻‍💨](https://github.com/Wanted-Pre-Onboarding-Team-E/geography-based-restaurant-recommendation/wiki/REST-API)

<br>

## :bookmark_tabs: 구현 내용

#### 사용자

- `계정명`, `비밀번호`를 사용하여 `회원가입`하고, `bcrypt`로 비밀번호를 `암호화`합니다.
- `Cookie`와 `JWT` 기반으로 인증합니다.
- 로그인 이후 모든 `API` 요청에 대해 `JWT` 유효성을 검증합니다.
- `인증된 사용자`는 사용자의 정보를 `조회`할 수 있습니다.
- 사용자는 `현재 위치`(위도/경도), `점심 추천 기능 사용 여부`를 `수정`할 수 있습니다.

#### 데이터 수집 및 전처리

- 공공데이터 `Open API` 중 <경기도_일반음식점 김밥(도시락), 일식, 중국식>을 사용했습니다.
- `Open API` 에 포함된 모든 필드를 팀 회의를 통해 재정의하였고, `null` 값의 경우 필드 타입에 맞게 디폴트 값을 설정하는 전처리 과정을 거쳐서 `DB`에 저장됩니다.
- 도로명 주소를 `Unique`로 설정하고 동일한 도로명 주소가 있다면 업데이트, 없다면 신규 등록됩니다.

#### 맛집

- 사용자 위도/경도를 기반으로 `주변 맛집 리스트`를 `조회`합니다.
    - 검색어, 거리 설정을 통한 맛집 리스트 조회
    - 거리순, 평점순으로 정렬 가능
- 평가 정보를 포함하여 `특정 맛집을 상세 조회`할 수 있습니다.
- 사용자는 특정 맛집에 대해 `평가`를 등록할 수 있습니다. 평가 점수에 따라 맛집의 총 평점이 업데이트 됩니다.

#### 자동화

- `Cron Job` 스케줄링을 통해 다음과 같이 자동화를 진행합니다.
- 매주 월요일~목요일 오전 05:00
    - `Open API` 호출을 통한 맛집 데이터 업데이트
- 매주 월요일 오전 12:00
    - 시군구 목록이 담긴 `.csv` 파일을 파싱 후 캐싱
- 매주 월요일~금요일 오전 11:30
    - 서비스 사용에 동의한 사용자 대상
    - 사용자 현재 위치에서 반경 500m 이내의 랜덤 카테고리(중식, 일식, 김밥) 중 1개의 맛집
    - 메뉴(이름과 가격) 3개를 포함
    - 디스코드 `Webhook URL`과 연결된 채널로 메세지를 전송  
      <img src="https://hackmd.io/_uploads/SkP845Lm6.png" width="50%">

#### 대규모 트래픽 대비 캐싱

- `시군구 목록` 데이터를 `캐싱`합니다.
    - 자주 변경되지 않으므로 만료 기간 없음
- `자주 조회되는 맛집` 상세 정보를 `캐싱`합니다.
    - 조회수 100 이상일 경우 캐싱
    - 600초 삭제 데드라인 설정

<br>

## :wave: 팀원 소개

|                                강희수                                |                                박동훈                                |                                신은수                                |                               이드보라                                |                                이승원                                |
|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|
| <img src="https://hackmd.io/_uploads/SJ-7MdLma.jpg" width="100"/> | <img src="https://hackmd.io/_uploads/B12ir7pGp.png" width="100"/> | <img src="https://hackmd.io/_uploads/HyZ86pjzp.png" width="100"/> | <img src="https://hackmd.io/_uploads/ByC5xOhz6.jpg" width="100"/> | <img src="https://hackmd.io/_uploads/B19HTJ6zp.jpg" width="100"/> |!
|              [@kangssu](https://github.com/kangssu)               |            [@laetipark](https://github.com/laetipark)             |              [@dawwson](https://github.com/dawwson)               |             [@sayapin1](https://github.com/sayapin1)              |             [@tomeee11](https://github.com/tomeee11)              |

<br>

#### 역할

- **강희수**
    - 공공데이터포털 `Open API` 사용 및 데이터 전처리 진행하여 데이터 저장
    - `NestJS Task Scheduling` 사용
- **박동훈**
    - `Typeorm` 마이그레이션
    - 사용자 회원가입 및 `JWT`를 이용한 로그인
    - 사용자 조회 및 점심 추천 여부, 위치 설정
    - 시군구 조회 및 `CSV`파일과 `Scheduling`을 이용한 시군구 목록 데이터 캐싱
    - 검색어 또는 필터링을 통한 `주변 맛집 리스트 조회`
- **신은수**
    - 보일러 플레이트 코드 작성 및 개발 환경 설정
    - 디스코드 `Webhook`을 사용한 점심 추천 기능 및 단위 테스트
- **이드보라**
    - `맛집 상세 정보` 불러오기 및 캐싱
    - `Redis` 사용
- **이승원**
    - `CSV` 데이터를 `Scheduling`을 통해 일정 주기마다 데이터 캐싱
    - `Redis` 사용하여 캐싱된 데이터 저장
    - 음식점 평가`API` 구현 및 단위 테스트
