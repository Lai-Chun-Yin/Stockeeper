docker build -t asia.gcr.io/stockeeper-210714/sk-nginx:latest -f ./nginx/Dockerfile.dev ./nginx
docker build -t asia.gcr.io/stockeeper-210714/sk-website:latest -f ./Dockerfile .
docker push asia.gcr.io/stockeeper-210714/sk-nginx:latest
docker push asia.gcr.io/stockeeper-210714/sk-website:latest
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "sh stack-deploy.sh"