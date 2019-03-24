docker build -t asia.gcr.io/stockeeper-210714/sk-nginx -f ./nginx/Dockerfile.dev ./nginx
docker build -t asia.gcr.io/stockeeper-210714/sk-website -f ./Dockerfile .
docker push asia.gcr.io/stockeeper-210714/sk-nginx:latest
docker push asia.gcr.io/stockeeper-210714/sk-website:latest
docker push asia.gcr.io/stockeeper-210714/sk-nginx:$SHA
docker push asia.gcr.io/stockeeper-210714/sk-website:$SHA
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "env SHA=$SHA docker stack deploy --with-registry-auth -c docker-compose.test.yml stockeeper"