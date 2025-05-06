import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StudentCard from '../components/Students/StudentCard';
import StudentForm from '../components/Students/StudentForm';
import DeleteConfirmation from '../components/common/DeleteConfirmation';
import EmptyState from '../components/common/EmptyState';
import { Student } from '../types';

const Students: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { students } = state;
  
  const handleAddStudent = () => {
    setIsAddingStudent(true);
  };
  
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };
  
  const handleDeleteStudent = (id: string) => {
    setDeletingStudentId(id);
  };
  
  const handleSubmitStudent = (student: Student) => {
    if (editingStudent) {
      dispatch({ type: 'UPDATE_STUDENT', payload: student });
      setEditingStudent(null);
    } else {
      dispatch({ type: 'ADD_STUDENT', payload: student });
      setIsAddingStudent(false);
    }
  };
  
  const handleCancelAddEdit = () => {
    setIsAddingStudent(false);
    setEditingStudent(null);
  };
  
  const confirmDeleteStudent = () => {
    if (deletingStudentId) {
      dispatch({ type: 'DELETE_STUDENT', payload: deletingStudentId });
      setDeletingStudentId(null);
    }
  };
  
  const cancelDeleteStudent = () => {
    setDeletingStudentId(null);
  };
  
  // Filter students based on search query
  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery) ||
    student.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          onClick={handleAddStudent}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          <span>Add Student</span>
        </button>
      </div>
      
      {students.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>
      )}
      
      {students.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Add your first student to start managing your tutoring business."
          icon={<Users size={64} />}
          actionText="Add Your First Student"
          onAction={handleAddStudent}
        />
      ) : filteredStudents.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No students match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={() => handleEditStudent(student)}
              onDelete={() => handleDeleteStudent(student.id)}
            />
          ))}
        </div>
      )}
      
      {(isAddingStudent || editingStudent) && (
        <StudentForm
          onSubmit={handleSubmitStudent}
          onCancel={handleCancelAddEdit}
          initialData={editingStudent || undefined}
          isEditing={!!editingStudent}
        />
      )}
      
      {deletingStudentId && (
        <DeleteConfirmation
          title="Delete Student"
          message="Are you sure you want to delete this student? This will also delete all associated classes and payment records."
          onConfirm={confirmDeleteStudent}
          onCancel={cancelDeleteStudent}
        />
      )}
    </div>
  );
};

export default Students;