'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  Building,
  Calendar,
  ListChecks,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit,
} from "lucide-react";
import { generateId } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

export function Experiences({ data, onChange }) {
  const [activeId, setActiveId] = useState(null);
  const [newAchievement, setNewAchievement] = useState("");
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(null);

  const handleAddExperience = () => {
    const newItem = {
      id: generateId(),
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      achievements: [],
    };
    onChange([...data, newItem]);
    setActiveId(newItem.id);
    setEditingAchievementIndex(null);
    setNewAchievement("");
  };

  const handleRemoveExperience = (id) => {
    onChange(data.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newData = [...data];
      [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
      onChange(newData);
    }
  };

  const handleMoveDown = (index) => {
    if (index < data.length - 1) {
      const newData = [...data];
      [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
      onChange(newData);
    }
  };

  const handleUpdateExperience = (id, field, value) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleCurrentChange = (id, checked) => {
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, current: checked, endDate: checked ? "" : item.endDate } : item
      )
    );
  };

  const handleAddAchievement = (experienceId) => {
    if (!newAchievement.trim()) return;
    if (editingAchievementIndex !== null) {
      onChange(
        data.map((item) =>
          item.id === experienceId
            ? {
              ...item,
              achievements: item.achievements.map((ach, i) =>
                i === editingAchievementIndex ? newAchievement.trim() : ach
              ),
            }
            : item
        )
      );
      setEditingAchievementIndex(null);
    } else {
      onChange(
        data.map((item) =>
          item.id === experienceId
            ? { ...item, achievements: [...item.achievements, newAchievement.trim()] }
            : item
        )
      );
    }
    setNewAchievement("");
  };

  const handleRemoveAchievement = (experienceId, index) => {
    onChange(
      data.map((item) =>
        item.id === experienceId
          ? { ...item, achievements: item.achievements.filter((_, i) => i !== index) }
          : item
      )
    );
    if (editingAchievementIndex === index) {
      setEditingAchievementIndex(null);
      setNewAchievement("");
    }
  };

  const handleEditAchievement = (experienceId, index) => {
    const achievement = data.find((item) => item.id === experienceId)?.achievements[index];
    if (achievement) {
      setNewAchievement(achievement);
      setEditingAchievementIndex(index);
    }
  };

  return (
    <div className="space-y-6 text-black">
      <div className="space-y-4">
        {data.map((experience, index) => (
          <Card
            key={experience.id}
            className={`bg-white/50 backdrop-blur-sm border shadow-sm transition-all duration-200 ${activeId === experience.id
              ? "border-primary/30 ring-2 ring-primary/10"
              : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <CardContent className="pt-4 text-black">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium">
                  {experience.role || "New Experience"}{" "}
                  {experience.company && `at ${experience.company}`}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setActiveId(activeId === experience.id ? null : experience.id)
                    }
                  >
                    <Edit className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === data.length - 1}
                  >
                    <MoveDown className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive/70 hover:text-destructive"
                    onClick={() => handleRemoveExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {activeId === experience.id && (
                <div className="space-y-4 text-black">
                  {/* Role */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-black" />
                      <Label className="text-sm font-medium">Role</Label>
                    </div>
                    <Input
                      value={experience.role}
                      onChange={(e) => handleUpdateExperience(experience.id, "role", e.target.value)}
                      placeholder="Enter role..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-black" />
                      <Label className="text-sm font-medium">Company Name</Label>
                    </div>
                    <Input
                      value={experience.company}
                      onChange={(e) => handleUpdateExperience(experience.id, "company", e.target.value)}
                      placeholder="Enter company name..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-black" />
                        <Label className="text-sm font-medium">Start Date</Label>
                      </div>
                      <Input
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => handleUpdateExperience(experience.id, "startDate", e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-black" />
                        <Label className="text-sm font-medium">End Date</Label>
                      </div>
                      <Input
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => handleUpdateExperience(experience.id, "endDate", e.target.value)}
                        disabled={experience.current}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={experience.current || false}
                      onCheckedChange={(checked) => handleCurrentChange(experience.id, checked)}
                    />
                    <Label>I currently work here</Label>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <ListChecks className="w-4 h-4 mr-2 text-black" />
                      <Label className="text-sm font-medium">Achievements/Tasks</Label>
                    </div>

                    <RichTextEditor
                      value={newAchievement}
                      onChange={setNewAchievement}
                      placeholder="Add achievement or responsibility..."
                    />

                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddAchievement(experience.id)}
                        disabled={!newAchievement.trim()}
                        className="flex items-center"
                      >
                        {editingAchievementIndex !== null ? (
                          <>
                            <Edit className="mr-1 h-4 w-4" /> Update
                          </>
                        ) : (
                          <>
                            <Plus className="mr-1 h-4 w-4" /> Add
                          </>
                        )}
                      </Button>
                    </div>

                    <ul className="space-y-2 mt-2">
                      {experience.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center">
                          <span className="mr-2">•</span>
                          <span dangerouslySetInnerHTML={{ __html: achievement }} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => handleRemoveAchievement(experience.id, i)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => handleEditAchievement(experience.id, i)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleAddExperience}
        className="w-full flex items-center justify-center"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}