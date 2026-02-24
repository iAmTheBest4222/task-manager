import TaskManager from './page';

export default function RootLayout() {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
        <TaskManager />
      </body>
    </html>
  );
}
