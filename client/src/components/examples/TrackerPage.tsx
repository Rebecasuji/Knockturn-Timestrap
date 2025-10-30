import TrackerPage from '../../pages/TrackerPage';

export default function TrackerPageExample() {
  localStorage.setItem('employee', JSON.stringify({
    id: 'EMP001',
    name: 'John Doe'
  }));
  
  return <TrackerPage />;
}
