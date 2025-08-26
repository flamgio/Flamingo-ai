
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [messageLimit, setMessageLimit] = useState([100]);
  const [fontSize, setFontSize] = useState(['14']);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('blue');

  const handleSave = () => {
    // Save settings to localStorage or send to backend
    const settings = {
      darkMode,
      soundEnabled,
      autoSave,
      messageLimit: messageLimit[0],
      fontSize: fontSize[0],
      language,
      theme
    };
    
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    setDarkMode(false);
    setSoundEnabled(true);
    setAutoSave(true);
    setMessageLimit([100]);
    setFontSize([14]);
    setLanguage('en');
    setTheme('blue');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <i className="fas fa-cog mr-3 text-blue-600"></i>
            Chat Settings
          </DialogTitle>
          <DialogDescription>
            Customize your chat experience and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appearance Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i className="fas fa-palette mr-2 text-blue-500"></i>
              Appearance
            </h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center space-x-2">
                <i className="fas fa-moon text-gray-600"></i>
                <span>Dark Mode</span>
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <i className="fas fa-paint-brush text-gray-600"></i>
                <span>Theme Color</span>
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Ocean Blue</SelectItem>
                  <SelectItem value="purple">Royal Purple</SelectItem>
                  <SelectItem value="green">Forest Green</SelectItem>
                  <SelectItem value="orange">Sunset Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <i className="fas fa-text-height text-gray-600"></i>
                <span>Font Size: {fontSize[0]}px</span>
              </Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={20}
                min={12}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i className="fas fa-comments mr-2 text-blue-500"></i>
              Chat Preferences
            </h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled" className="flex items-center space-x-2">
                <i className="fas fa-volume-up text-gray-600"></i>
                <span>Sound Effects</span>
              </Label>
              <Switch
                id="sound-enabled"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="flex items-center space-x-2">
                <i className="fas fa-save text-gray-600"></i>
                <span>Auto-save Conversations</span>
              </Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <i className="fas fa-list-ol text-gray-600"></i>
                <span>Message History Limit: {messageLimit[0]} messages</span>
              </Label>
              <Slider
                value={messageLimit}
                onValueChange={setMessageLimit}
                max={500}
                min={50}
                step={25}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <i className="fas fa-globe text-gray-600"></i>
                <span>Language</span>
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i className="fas fa-cogs mr-2 text-blue-500"></i>
              Advanced
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium mb-1">Performance Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Lower message limits improve loading speed</li>
                    <li>Dark mode reduces eye strain in low light</li>
                    <li>Auto-save keeps your conversations secure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-undo mr-2"></i>
            Reset to Defaults
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <i className="fas fa-check mr-2"></i>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
