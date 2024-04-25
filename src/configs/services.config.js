const gmailService = {
  host: "localhost",
  port: 9000,
};

module.exports = {
  gmailService: {
    ...gmailService,
    url: `http://${gmailService.host}:${gmailService.port}`,
  },
};
