docker build -t asia.gcr.io/stockeeper-210714/sk-nginx -f ./Stockeeper/nginx/Dockerfile.dev ./Stockeeper/nginx
docker push asia.gcr.io/stockeeper-210714/sk-nginx
docker push asia.gcr.io/stockeeper-210714/sk-website
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "docker stack deploy --with-registry-auth -c docker-compose.test.yml stockeeper"