import app from './app';

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Log monitoring service is running on port ${port}`);
});

