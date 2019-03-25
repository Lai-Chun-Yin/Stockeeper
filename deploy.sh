docker build -t asia.gcr.io/stockeeper-210714/sk-nginx -f ./nginx/Dockerfile.dev ./nginx
docker build -t asia.gcr.io/stockeeper-210714/sk-website -f ./Dockerfile .
docker push asia.gcr.io/stockeeper-210714/sk-nginx
docker push asia.gcr.io/stockeeper-210714/sk-website
# ssh to GCP
nohup gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" --command "sh stack-deploy.sh" &