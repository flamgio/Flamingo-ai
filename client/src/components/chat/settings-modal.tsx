
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsState {
  appearance: {
    darkMode: boolean;
    theme: string;
    fontSize: number;
    language: string;
    compactMode: boolean;
  };
  chat: {
    soundEnabled: boolean;
    autoSave: boolean;
    messageLimit: number;
    typingIndicators: boolean;
    timestamps: boolean;
    enterToSend: boolean;
  };
  ai: {
    defaultModel: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    enableEnhancement: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReportsEnabled: boolean;
    dataRetention: string;
  };
}

const SettingCard = ({ icon, title, description, children }: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
    whileHover={{ y: -2 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <i className={`${icon} text-white text-lg`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const SettingRow = ({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1 min-w-0 pr-4">
      <label className="text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
    <div className="flex-shrink-0">
      {children}
    </div>
  </div>
);

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState<SettingsState>({
    appearance: {
      darkMode: false,
      theme: 'blue',
      fontSize: 14,
      language: 'en',
      compactMode: false,
    },
    chat: {
      soundEnabled: true,
      autoSave: true,
      messageLimit: 100,
      typingIndicators: true,
      timestamps: true,
      enterToSend: true,
    },
    ai: {
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '',
      enableEnhancement: true,
    },
    privacy: {
      analyticsEnabled: true,
      crashReportsEnabled: true,
      dataRetention: '30d',
    },
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('flamgio-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (category: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem('flamgio-settings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    setSettings({
      appearance: {
        darkMode: false,
        theme: 'blue',
        fontSize: 14,
        language: 'en',
        compactMode: false,
      },
      chat: {
        soundEnabled: true,
        autoSave: true,
        messageLimit: 100,
        typingIndicators: true,
        timestamps: true,
        enterToSend: true,
      },
      ai: {
        defaultModel: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: '',
        enableEnhancement: true,
      },
      privacy: {
        analyticsEnabled: true,
        crashReportsEnabled: true,
        dataRetention: '30d',
      },
    });
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
    { id: 'chat', label: 'Chat', icon: 'fas fa-comments' },
    { id: 'ai', label: 'AI Model', icon: 'fas fa-brain' },
    { id: 'privacy', label: 'Privacy', icon: 'fas fa-shield-alt' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-[80vh]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                <i className="fas fa-cog mr-3 text-blue-600"></i>
                Settings
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Customize your Flamgio AI experience
              </DialogDescription>
            </DialogHeader>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className={`${tab.icon} w-5 h-5`}></i>
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1 text-xs"
                >
                  <i className="fas fa-undo mr-1"></i>
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  <i className="fas fa-check mr-1"></i>
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard
                    icon="fas fa-paint-brush"
                    title="Visual Preferences"
                    description="Customize the look and feel of your interface"
                  >
                    <SettingRow
                      label="Dark Mode"
                      description="Switch between light and dark themes"
                    >
                      <Switch
                        checked={settings.appearance.darkMode}
                        onCheckedChange={(value) => updateSettings('appearance', 'darkMode', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label="Theme Color"
                      description="Choose your preferred color scheme"
                    >
                      <Select
                        value={settings.appearance.theme}
                        onValueChange={(value) => updateSettings('appearance', 'theme', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Ocean Blue</SelectItem>
                          <SelectItem value="purple">Royal Purple</SelectItem>
                          <SelectItem value="green">Forest Green</SelectItem>
                          <SelectItem value="orange">Sunset Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingRow>

                    <SettingRow
                      label={`Font Size: ${settings.appearance.fontSize}px`}
                      description="Adjust text size for better readability"
                    >
                      <div className="w-40">
                        <Slider
                          value={[settings.appearance.fontSize]}
                          onValueChange={([value]) => updateSettings('appearance', 'fontSize', value)}
                          max={20}
                          min={12}
                          step={1}
                        />
                      </div>
                    </SettingRow>

                    <SettingRow
                      label="Compact Mode"
                      description="Reduce spacing for a denser layout"
                    >
                      <Switch
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(value) => updateSettings('appearance', 'compactMode', value)}
                      />
                    </SettingRow>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard
                    icon="fas fa-comment-dots"
                    title="Chat Behavior"
                    description="Control how your chat interface works"
                  >
                    <SettingRow
                      label="Sound Effects"
                      description="Play sounds for new messages and actions"
                    >
                      <Switch
                        checked={settings.chat.soundEnabled}
                        onCheckedChange={(value) => updateSettings('chat', 'soundEnabled', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label="Auto-save Conversations"
                      description="Automatically save your chat history"
                    >
                      <Switch
                        checked={settings.chat.autoSave}
                        onCheckedChange={(value) => updateSettings('chat', 'autoSave', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label="Enter to Send"
                      description="Send messages with Enter key (Shift+Enter for new line)"
                    >
                      <Switch
                        checked={settings.chat.enterToSend}
                        onCheckedChange={(value) => updateSettings('chat', 'enterToSend', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label={`Message History Limit: ${settings.chat.messageLimit} messages`}
                      description="Number of messages to keep in memory"
                    >
                      <div className="w-40">
                        <Slider
                          value={[settings.chat.messageLimit]}
                          onValueChange={([value]) => updateSettings('chat', 'messageLimit', value)}
                          max={500}
                          min={50}
                          step={25}
                        />
                      </div>
                    </SettingRow>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard
                    icon="fas fa-robot"
                    title="AI Model Configuration"
                    description="Configure AI behavior and parameters"
                  >
                    <SettingRow
                      label="Default Model"
                      description="Choose your preferred AI model"
                    >
                      <Select
                        value={settings.ai.defaultModel}
                        onValueChange={(value) => updateSettings('ai', 'defaultModel', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                          <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingRow>

                    <SettingRow
                      label={`Temperature: ${settings.ai.temperature}`}
                      description="Controls randomness in responses (0.0 = deterministic, 1.0 = creative)"
                    >
                      <div className="w-40">
                        <Slider
                          value={[settings.ai.temperature]}
                          onValueChange={([value]) => updateSettings('ai', 'temperature', value)}
                          max={1}
                          min={0}
                          step={0.1}
                        />
                      </div>
                    </SettingRow>

                    <SettingRow
                      label="Enable Prompt Enhancement"
                      description="Use AI to improve your prompts automatically"
                    >
                      <Switch
                        checked={settings.ai.enableEnhancement}
                        onCheckedChange={(value) => updateSettings('ai', 'enableEnhancement', value)}
                      />
                    </SettingRow>

                    <div className="pt-4">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                        System Prompt
                      </Label>
                      <Textarea
                        value={settings.ai.systemPrompt}
                        onChange={(e) => updateSettings('ai', 'systemPrompt', e.target.value)}
                        placeholder="Enter a custom system prompt to guide AI behavior..."
                        className="min-h-20"
                      />
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard
                    icon="fas fa-lock"
                    title="Privacy & Data"
                    description="Control your data and privacy preferences"
                  >
                    <SettingRow
                      label="Analytics"
                      description="Help improve the app by sharing anonymous usage data"
                    >
                      <Switch
                        checked={settings.privacy.analyticsEnabled}
                        onCheckedChange={(value) => updateSettings('privacy', 'analyticsEnabled', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label="Crash Reports"
                      description="Automatically send crash reports to help fix bugs"
                    >
                      <Switch
                        checked={settings.privacy.crashReportsEnabled}
                        onCheckedChange={(value) => updateSettings('privacy', 'crashReportsEnabled', value)}
                      />
                    </SettingRow>

                    <SettingRow
                      label="Data Retention"
                      description="How long to keep your chat history"
                    >
                      <Select
                        value={settings.privacy.dataRetention}
                        onValueChange={(value) => updateSettings('privacy', 'dataRetention', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="90d">90 days</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingRow>
                  </SettingCard>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-info-circle text-amber-600 dark:text-amber-400 mt-1"></i>
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Privacy First
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          Your conversations are encrypted and stored securely. We never share your personal data with third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
