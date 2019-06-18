import S3 from 'aws-sdk/clients/s3';
const s3 = new S3();

export const getS3File = async file => {
  const params = {
    Bucket: 'lol-stats-disco',
    Key: file,
    Body: file,
  };

  const response = await s3.getObject(params, err => {
    if (err) {
      return response.err;
    }
  });

  return response.Body.toString(); // your file as a string
};

export const pushS3File = async file => {
  const params = {
    Body: data, // MAKE THIS BINARY
    Bucket: 'lol-stats-disco',
    Key: file,
    ServerSideEncryption: 'AES256',
    Tagging: 'key1=value1&key2=value2',
  };

  const response = await s3.putObject(params, err => {
    if (err) {
      return response.err;
    }
  });

  return response;
};
