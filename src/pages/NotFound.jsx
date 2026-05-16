import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-canvas px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.18em] text-muted">Error 404</p>
        <h1 className="font-display text-[56px] leading-[1.05] tracking-[-0.025em] text-ink md:text-[72px]">
          That page didn't make it to the syllabus.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-body">
          The link you followed is broken, expired, or never existed. No fault of yours — just one of those things.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Open dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
