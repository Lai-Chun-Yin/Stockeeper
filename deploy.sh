docker build -t asia.gcr.io/stockeeper-210714/sk-nginx:$SHA -f ./nginx/Dockerfile.dev ./nginx
docker build -t asia.gcr.io/stockeeper-210714/sk-website:$SHA -f ./Dockerfile .
docker push asia.gcr.io/stockeeper-210714/sk-nginx:$SHA
docker push asia.gcr.io/stockeeper-210714/sk-website:$SHA
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "env SHA=latest docker stack deploy --with-registry-auth -c docker-compose.test.yml stockeeper"