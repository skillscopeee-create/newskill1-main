import React from 'react';
import { dummyData, Resource } from '../data/dummyData';
import Card from '../components/Card';
import { StarIcon, EyeIcon, CodeIcon, DesignIcon, DataIcon } from '../components/IconComponents';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block w-64 flex-shrink-0">
        <Card className="flex flex-col overflow-hidden h-full">
            <img src={resource.thumbnail} alt={resource.title} className="w-full h-32 object-cover" />
            <div className="p-3 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-white/50 mb-1">{resource.provider.toUpperCase()}</span>
                <h3 className="font-bold text-base mb-2 text-white flex-grow">{resource.title}</h3>
                <div className="flex items-center justify-between text-xs text-white/70 mt-auto">
                    <div className="flex items-center gap-1">
                        <StarIcon className="text-yellow-400 w-4 h-4" />
                        <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4"/>
                        <span>{resource.views}</span>
                    </div>
                </div>
            </div>
        </Card>
    </a>
);

const CategorySection: React.FC<{ title: string; icon: React.ReactNode; resources: Resource[] }> = ({ title, icon, resources }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="bg-glass-bg border border-glass-border p-2 rounded-lg">{icon}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    </div>
);


const Resources: React.FC = () => {
    const webDevResources = dummyData.filter(r => r.category === 'Web Development');
    const designResources = dummyData.filter(r => r.category === 'UI/UX Design');
    const dataSciResources = dummyData.filter(r => r.category === 'Data Science');

  return (
    <div className="space-y-12">
        <h1 className="text-3xl md:text-4xl font-bold">Popular Resources</h1>
        <CategorySection title="Web Development" icon={<CodeIcon />} resources={webDevResources} />
        <CategorySection title="UI/UX Design" icon={<DesignIcon />} resources={designResources} />
        <CategorySection title="Data Science" icon={<DataIcon />} resources={dataSciResources} />
    </div>
  );
};

export default Resources;
