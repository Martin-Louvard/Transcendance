FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000
EXPOSE 5555

COPY tools/nestscript.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/nestscript.sh

ENTRYPOINT ["bash", "nestscript.sh"]
