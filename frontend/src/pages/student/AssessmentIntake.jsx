// frontend/src/pages/student/AssessmentIntake.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Essential for reading the link ID
import Navbar from "../../components/Navbar";

const AssessmentIntake = () => {
  const { domainId } = useParams(); // Grabs the ID from the URL link
  const [assignment, setAssignment] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific assignment details using the ID from the link
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`http://localhost:9000/api/custom-domains/${domainId}`);
        const result = await res.json();
        if (result.status === "success") {
          setAssignment(result.data);
        }
      } catch (err) {
        console.error("Failed to load assignment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [domainId]);

  if (loading) return <div className="p-10 text-center">Loading Assignment...</div>;
  if (!assignment) return <div className="p-10 text-center">Assignment not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto p-8 max-w-2xl">
        {!isStarted ? (
          // Preview / Landing View
          <div className="bg-white p-8 rounded-3xl shadow-xl border text-center">
            <h1 className="text-3xl font-bold mb-4">{assignment.name}</h1>
            <p className="text-slate-600 mb-8">{assignment.userPrompt}</p>
            <div className="flex justify-center gap-8 mb-8 text-sm font-bold text-slate-500">
              <span>Questions: {assignment.questionLimit}</span>
              <span>Difficulty: Level {assignment.difficulty}</span>
            </div>
            {/* The button that triggers the test loading */}
            <button 
              onClick={() => setIsStarted(true)} 
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all"
            >
              Start Assignment Now
            </button>
          </div>
        ) : (
          // This part renders the actual Quiz component
          <div className="bg-white p-8 rounded-3xl shadow-xl border">
             <h2 className="text-xl font-bold mb-4">Quiz in Progress...</h2>
             {/* Import and insert your existing QuizPage or Quiz component here */}
             {/* Pass the assignment data to it */}
             <p>Loading questions for: {assignment.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentIntake;