FROM nginx:alpine

COPY enchanted_shadows/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
