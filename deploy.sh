docker build -t asia.gcr.io/stockeeper-210714/sk-nginx:latest -f ./nginx/Dockerfile.dev ./nginx
docker build -t asia.gcr.io/stockeeper-210714/sk-website:latest -f ./Dockerfile .
docker push asia.gcr.io/stockeeper-210714/sk-nginx:latest
docker push asia.gcr.io/stockeeper-210714/sk-website:latest
gcloud compute --project "stockeeper-210714" scp --zone "asia-east1-b" ./docker-compose.test.yml "stockeeper-init":~
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "docker stack deploy --resolve-image always --with-registry-auth -c docker-compose.test.yml stockeeper"