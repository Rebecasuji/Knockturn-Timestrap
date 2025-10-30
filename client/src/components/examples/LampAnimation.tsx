import LampAnimation from '../LampAnimation';

export default function LampAnimationExample() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LampAnimation onPullComplete={() => console.log('Lamp pulled!')} />
    </div>
  );
}
