'use client';
import { useState, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BasicInfo } from '@/components/sections/BasicInfo';
import { Summary } from '@/components/sections/Summary';
import { Experiences } from '@/components/sections/Experiences';
import { Education } from '@/components/sections/Education';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { GeneralSection } from '@/components/sections/GeneralSection';
import { ThemeSelector } from '@/components/ThemeSelector';
import { TailorCVDialog } from '@/components/TailorCVDialog';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { AddSection } from '@/components/AddSectionPanel';
import { DownloadOptions } from '@/components/DownloadOptions';
import { downloadJSON, readJSONFile } from '@/lib/utils';
import {
  Upload,
  FileJson,
  Settings,
  Palette,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar({ data, onChange }) {
  const [expandedSections, setExpandedSections] = useState(['basicInfo']);
  const [importKey, setImportKey] = useState(0);
  const fileInputRef = useRef(null);

  const handleThemeChange = (theme) => {
    onChange({ ...data, activeTheme: theme });
  };

  const handleTailoredCV = (tailoredData) => {
    onChange(tailoredData);
  };

  const handleExportJSON = () => {
    downloadJSON(data, 'cv-data.json');
    toast.success('CV data exported successfully');
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await readJSONFile(file);
      onChange(importedData);
      toast.success('CV data imported successfully');
      setImportKey(prev => prev + 1);
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('Failed to import CV data. Please check the file format.');
    }
  };

  const triggerImportDialog = () => {
    fileInputRef.current?.click();
  };

  const sections = Object.keys(data)
    .filter(key => key !== 'activeTheme' && key !== 'sectionConfig')
    .map(key => ({
      id: key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
    }));

  const Components = {
    basicInfo: BasicInfo,
    summary: Summary,
    experiences: Experiences,
    education: Education,
    skills: Skills,
    projects: Projects
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0e7472] border-r backdrop-blur-sm text-black">
      <div className="p-4 border-b flex justify-between items-center text-black">
        <div>
          <h2 className="text-lg font-medium">ImpactCV</h2>
          <p className="text-sm text-muted-foreground">Configure your CV content and appearance</p>
        </div>

        <div className="relative text-black">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={triggerImportDialog}
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          <input
            ref={fileInputRef}
            key={importKey}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-2 text-black" style={{ maxHeight: 'calc(100vh - 82px)' }}>
        <div className="space-y-6 text-black">
          <Accordion
            type="multiple"
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="space-y-4 text-black"
          >
            {sections.map((section) => {
              const Component = Components[section.id] ?? GeneralSection;
              return (
                <AccordionItem key={section.id} value={section.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-100/50 transition-colors">
                    {section.label}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-4 pb-4">
                    <Component
                      data={data[section.id]}
                      onChange={(newData) => onChange({ ...data, [section.id]: newData })}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}

            <div className="w-full flex items-center justify-between">
              <AddSection cvData={data} onChange={onChange} />
              <ConfigurationPanel cvData={data} onChange={onChange} />
            </div>

            <AccordionItem value="theme" className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Theme</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 px-4 pb-4">
                <ThemeSelector
                  selectedTheme={data.activeTheme}
                  onChange={handleThemeChange}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-4 py-4">
            <div className="space-y-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
              <DownloadOptions cvData={data} />
            </div>

            <div className="space-y-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Configuration</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <TailorCVDialog cvData={data} onTailored={handleTailoredCV} />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Export</h3>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 hover:text-gray-600 justify-center"
                  onClick={handleExportJSON}
                >
                  <FileJson className="h-4 w-4 " />
                  <span>Export JSON</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}