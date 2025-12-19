import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, BookOpen } from "lucide-react";

const AssignmentTake = () => {
  const { domainId } = useParams();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) return alert("Please enter a valid email");
    // Navigate to quiz with mode parameters
    navigate(`/quiz/${domainId}?email=${encodeURIComponent(email)}&isAssignment=true`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-8 border-brand-600">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="text-brand-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Subject Assessment</h2>
        <p className="text-gray-500 mb-8">Please enter your email to begin this 15-question test. Results will be sent to your teacher.</p>
        <input 
          type="email" 
          className="w-full p-4 border rounded-xl mb-6 focus:ring-2 focus:ring-brand-500 outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleStart} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
          Start Assessment <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AssignmentTake;