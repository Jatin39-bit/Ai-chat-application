import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Avatar from './Avatar';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/project', {
      state: { project }
    });
  };

  return (
    <Card 
      hoverable 
      className="h-full flex flex-col justify-between" 
      onClick={handleClick}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <Card.Title>{project.name}</Card.Title>
          <Badge variant="primary">
            {project.users.length} {project.users.length === 1 ? 'member' : 'members'}
          </Badge>
        </div>
        
        <Card.Description>
          Collaborative coding project
        </Card.Description>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {project.users.slice(0, 5).map((user) => (
              <Avatar 
                key={user._id}
                name={user.email}
                className="border-2 border-white"
                title={user.email}
              />
            ))}
            {project.users.length > 5 && (
              <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                +{project.users.length - 5}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard; 