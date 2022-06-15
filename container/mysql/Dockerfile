#使うDockerイメージ
FROM mysql

#ポートの設定
EXPOSE 3306

#ロケール設定
RUN apt-get update
RUN apt-get -y install locales-all
RUN apt-get -y install vim

#secure-file-priv設定変更
RUN sed -i -e "s/secure-file-priv= NULL/secure-file-priv= ''/g" /etc/mysql/my.cnf

ENV MYSQL_ROOT_PASSWORD pass
ENV MYSQL_DATABASE quiz_db

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

#docker run時の実行コマンド
CMD ["mysqld"]