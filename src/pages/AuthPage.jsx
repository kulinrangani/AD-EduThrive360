import { useState } from 'react';
import {
  IconHeart,
  IconMail,
  IconLock,
  IconEye,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
} from '../component/Icons.jsx';
import { Badge, Input, Button, Sparkline } from '../component/UI.jsx';

// Decorative illustration — NO copyrighted imagery. Abstract geometric composition using brand colors.
function AuthIllustration() {
  return (
    <div className="w-full h-full rounded-2xl relative overflow-hidden grain bg-gradient-to-br from-ink to-inkSoft">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal/40 blur-3xl"/>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-orange/25 blur-3xl"/>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-yellow/20 blur-2xl"/>
      </div>

      <div className="relative h-full flex flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal to-yellow flex items-center justify-center shadow-lift">
              <span className="font-display text-ink font-bold text-xl">E</span>
            </div>
            <div>
              <div className="font-display text-xl text-beige">EduThrive<span className="text-orange">360</span></div>
              <div className="text-[11px] text-beige/50 tracking-wide uppercase">Super Admin</div>
            </div>
          </div>
        </div>

        <div className="relative h-[340px]">
          <div className="absolute top-4 left-4 right-8 p-5 rounded-2xl bg-beige/95 backdrop-blur shadow-lift rotate-[-3deg]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal/15 text-teal flex items-center justify-center"><IconHeart size={18}/></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Average wellness</div>
                <div className="font-display text-3xl leading-none">74.1</div>
              </div>
            </div>
            <div className="mt-3">
              <Sparkline data={[60,62,58,66,70,68,74]} w={260} h={36}/>
            </div>
          </div>

          <div className="absolute top-40 left-16 right-4 p-5 rounded-2xl bg-orange/90 text-ink shadow-lift rotate-[2deg] backdrop-blur">
            <div className="text-xs uppercase tracking-wider font-semibold">This week</div>
            <div className="font-display text-2xl mt-1">1,204 sessions logged</div>
            <div className="flex items-center gap-2 mt-3">
              {['MNS','SRI','KPR','AGK','VSH'].map((i,x) => (
                <span key={x} className="w-8 h-8 rounded-full bg-ink text-beige text-[10px] font-bold flex items-center justify-center border-2 border-orange">{i}</span>
              ))}
              <span className="text-sm ml-1 font-semibold">+ 181</span>
            </div>
          </div>

          <div className="absolute bottom-0 right-4 p-4 rounded-2xl bg-yellow shadow-lift rotate-[-1deg]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ink pulse-dot"/>
              <span className="text-xs font-bold uppercase tracking-wide">24 schools thriving</span>
            </div>
          </div>
        </div>

        <div>
          <p className="font-display text-2xl text-beige leading-snug max-w-sm">
            "A calmer school begins with knowing how every student is <span className="text-orange italic">actually</span> doing."
          </p>
          <p className="text-beige/60 text-sm mt-3">Internal wellness platform for partner schools.</p>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onForgot }) {
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen bg-beige p-4 md:p-8 flex items-center justify-center fade-in">
      <div className="w-full max-w-[1160px] grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-white rounded-3xl shadow-lift overflow-hidden border border-ink/5">
        <div className="hidden lg:block p-5">
          <AuthIllustration/>
        </div>

        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-yellow flex items-center justify-center">
              <span className="font-display text-ink font-bold">E</span>
            </div>
            <div className="font-display text-lg">EduThrive<span className="text-orange">360</span></div>
          </div>

          <Badge tone="teal" className="self-start mb-4">Super Admin</Badge>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.05]">Welcome <br/><span className="italic text-teal">back.</span></h1>
          <p className="text-ink/60 mt-3 max-w-sm">Sign in to oversee your schools, counselors, and wellness programs.</p>

          <form className="mt-8 space-y-4" onSubmit={(e)=>{ e.preventDefault(); onLogin(); }}>
            <div>
              <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Work email</label>
              <Input className="mt-1.5" icon={<IconMail size={16}/>} type="email" defaultValue="aarav@eduthrive.io" placeholder="you@school.edu"/>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Password</label>
                <button type="button" onClick={onForgot} className="text-xs text-teal hover:underline font-semibold">Forgot?</button>
              </div>
              <div className="relative mt-1.5">
                <Input icon={<IconLock size={16}/>} type={show?'text':'password'} defaultValue="••••••••••" />
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink">
                  <IconEye size={16}/>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" className="accent-teal w-4 h-4"/> Keep me signed in for 7 days
            </label>

            <Button size="lg" className="w-full" iconRight={<IconArrowRight size={16}/>}>Sign in</Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-ink/10"/>
              <span className="text-xs text-ink/40 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-ink/10"/>
            </div>

            <Button variant="outline" size="lg" className="w-full">Continue with SSO</Button>
          </form>

          <p className="text-xs text-ink/50 mt-8">Protected by EduThrive Safety Cloud · India region · SOC 2 Type II</p>
        </div>
      </div>
    </div>
  );
}

function ForgotPage({ onBack }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-beige p-4 md:p-8 flex items-center justify-center fade-in">
      <div className="w-full max-w-[1160px] grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-white rounded-3xl shadow-lift overflow-hidden border border-ink/5">
        <div className="hidden lg:block p-5"><AuthIllustration/></div>

        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <button onClick={onBack} className="self-start text-sm text-ink/60 hover:text-teal font-medium inline-flex items-center gap-2 mb-6">
            <IconArrowLeft size={14}/> Back to sign in
          </button>

          {!sent ? (
            <>
              <Badge tone="orange" className="self-start mb-4">Password reset</Badge>
              <h1 className="font-display text-4xl md:text-5xl leading-[1.05]">Let's get you <br/><span className="italic text-teal">back in.</span></h1>
              <p className="text-ink/60 mt-3 max-w-sm">Enter the email linked to your admin account and we'll send a reset link.</p>

              <form className="mt-8 space-y-4" onSubmit={(e)=>{ e.preventDefault(); setSent(true); }}>
                <div>
                  <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Work email</label>
                  <Input className="mt-1.5" icon={<IconMail size={16}/>} type="email" placeholder="you@school.edu"/>
                </div>
                <Button size="lg" className="w-full" iconRight={<IconArrowRight size={16}/>}>Send reset link</Button>
              </form>

              <div className="mt-8 p-4 rounded-xl bg-beige/60 text-sm text-ink/70">
                Still locked out? Contact <a className="text-teal font-semibold underline-offset-2 hover:underline" href="#">security@eduthrive.io</a> for manual verification.
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-teal/15 text-teal flex items-center justify-center mb-5"><IconCheck size={28}/></div>
              <h1 className="font-display text-4xl leading-[1.05]">Check your inbox.</h1>
              <p className="text-ink/60 mt-3 max-w-sm">If an admin account exists for that email, a reset link is on its way. The link expires in 30 minutes.</p>
              <Button size="lg" className="w-full mt-6" onClick={onBack} icon={<IconArrowLeft size={16}/>}>Return to sign in</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { LoginPage, ForgotPage };
