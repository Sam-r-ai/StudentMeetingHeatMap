To start Dockerfile:

To build the container:
```bash
docker build -t studentmeetingheatmap .
```

To run the container:

```bash
docker run -p 3000:3000 studentmeetingheatmap
```

Then go to localhost:3000 in your browser.

When you exit, remember to kill the docker process. Run command docker ps -> then copy the number (something like 306ccbe5f009) -> then run docker kill that number (e.g 306ccbe5f009)
