docker build -t tommylcy/sk-nginx -f ./nginx/Dockerfile.dev ./nginx
docker push tommylcy/sk-nginx
docker push tommylcy/sk-website
git config credential.helper gcloud.sh
git remote add google \
https://source.developers.google.com/p/Stockeeper/r/Stockeeper
git push --all google
# ssh to GCP
gcloud compute --project "stockeeper-210714" ssh --zone "asia-east1-b" "stockeeper-init" -- "docker stack deploy -c docker-compose.test.yml stockeeper"