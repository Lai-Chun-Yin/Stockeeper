docker build -t tommylcy/sk-nginx -f ./nginx/Dockerfile.dev ./nginx
docker push tommylcy/sk-nginx
docker push tommylcy/sk-website
# ssh to GCP
nohup gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" -- "docker stack deploy -c docker-compose.test.yml stockeeper" &