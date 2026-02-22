import { useState, useCallback, useEffect, useRef } from 'react';
import { CHARACTERS } from './data/characters';
import { TOPICS_BY_GRADE } from './data/grades';
import { getTelegramUser, apiAuth, apiSaveSettings, apiSaveProgress, apiSaveExpress } from './api';
import ThemedParticles from './components/ui/ThemedParticles';
import BottomNav, { useSwipeBack } from './components/ui/BottomNav';
import WelcomeScreen from './components/screens/WelcomeScreen';
import CharacterScreen from './components/screens/CharacterScreen';
import GradeScreen from './components/screens/GradeScreen';
import MethodScreen from './components/screens/MethodScreen';
import TopicsScreen from './components/screens/TopicsScreen';
import ExerciseScreen from './components/screens/ExerciseScreen';
import FlashcardsScreen from './components/screens/FlashcardsScreen';
import ExpressTestScreen from './components/screens/ExpressTestScreen';

const SCREEN_BACK_MAP = {
  character: "welcome",
  grade: "character",
  method: "grade",
  topics: "grade",
  exercise: "topics",
  flashcards: "topics",
  express: "topics",
};

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [character, setCharacter] = useState(null);
  const [grade, setGrade] = useState(null);
  const [topic, setTopic] = useState(null);
  const [topicMode, setTopicMode] = useState("exercises");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [tgUser, setTgUser] = useState(null);
  const [serverProgress, setServerProgress] = useState({});
  const [offline, setOffline] = useState(false);
  const authDone = useRef(false);
  const isReturning = useRef(false);
  const savedCharacter = useRef(null);
  const savedGrade = useRef(null);

  // Spaced repetition: { topicId: Set<questionId> }
  const [reviewTopics, setReviewTopics] = useState({});

  const markForReview = useCallback((topicId, questionId) => {
    setReviewTopics(prev => {
      const next = { ...prev };
      if (!next[topicId]) next[topicId] = new Set();
      else next[topicId] = new Set(next[topicId]);
      next[topicId].add(questionId);
      return next;
    });
  }, []);

  const clearFromReview = useCallback((topicId, questionId) => {
    setReviewTopics(prev => {
      const next = { ...prev };
      if (!next[topicId]) return prev;
      next[topicId] = new Set(next[topicId]);
      next[topicId].delete(questionId);
      if (next[topicId].size === 0) delete next[topicId];
      return next;
    });
  }, []);

  // --- Auth on load (runs silently while welcome screen shows) ---
  useEffect(() => {
    if (authDone.current) return;
    authDone.current = true;
    const user = getTelegramUser();
    setTgUser(user);

    apiAuth(user).then(data => {
      if (!data) {
        console.log('[GeoLab] Сервер недоступен — работаем оффлайн');
        setOffline(true);
        return;
      }
      // Restore progress map
      if (data.progress?.length) {
        const map = {};
        data.progress.forEach(p => { map[p.topic_id] = p; });
        setServerProgress(map);
      }
      // Remember returning user data (don't navigate yet — user is on welcome screen)
      if (data.user.character_id && data.user.character_id !== 'owl' && data.user.grade) {
        isReturning.current = true;
        savedCharacter.current = data.user.character_id;
        savedGrade.current = data.user.grade;
      }
    });
  }, []);

  // --- "Начать" button handler ---
  const handleStart = useCallback(() => {
    if (isReturning.current) {
      // Returning user → restore settings and go to topics
      setCharacter(savedCharacter.current);
      setGrade(savedGrade.current);
      setScreen("topics");
    } else {
      // New user → character selection
      setScreen("character");
    }
  }, []);

  // --- Save grade & character when changed ---
  const handleSelectCharacter = useCallback((c) => {
    setCharacter(c);
    setScreen("grade");
    if (tgUser) apiSaveSettings(tgUser.tg_id, grade, c);
  }, [tgUser, grade]);

  const handleSelectGrade = useCallback((g) => {
    setGrade(g);
    setScreen("topics");
    if (tgUser) apiSaveSettings(tgUser.tg_id, g, character);
  }, [tgUser, character]);

  // --- Save exercise result ---
  const handleExerciseComplete = useCallback((topicId, score) => {
    if (tgUser) apiSaveProgress(tgUser.tg_id, topicId, score);
    setServerProgress(prev => ({
      ...prev,
      [topicId]: {
        score,
        best_score: Math.max(score, prev[topicId]?.best_score || 0),
        attempts: (prev[topicId]?.attempts || 0) + 1,
      }
    }));
  }, [tgUser]);

  // --- Save express test result ---
  const handleExpressComplete = useCallback((topicId, correct, wrong, bestStreak, timeLeft) => {
    if (tgUser) apiSaveExpress(tgUser.tg_id, topicId, correct, wrong, bestStreak, timeLeft);
  }, [tgUser]);

  const goBack = useCallback(() => {
    const prev = SCREEN_BACK_MAP[screen];
    if (prev) setScreen(prev);
  }, [screen]);

  const canGoBack = !!SCREEN_BACK_MAP[screen];
  useSwipeBack(goBack, canGoBack);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    if (canGoBack) {
      tg.BackButton.show();
      tg.BackButton.onClick(goBack);
    } else {
      tg.BackButton.hide();
    }
    return () => { if (tg?.BackButton) tg.BackButton.offClick(goBack); };
  }, [canGoBack, goBack]);

  const handleTopicSelect = useCallback((topicId, mode) => {
    setTopic(topicId);
    const targetScreen = mode === "flashcards" ? "flashcards" : mode === "express" ? "express" : "exercise";
    setScreen(targetScreen);
  }, []);

  const getTopicTitle = () => {
    if (!grade || !topic) return "";
    const topics = TOPICS_BY_GRADE[grade] || [];
    const t = topics.find(t => t.id === topic);
    return t?.title || "";
  };

  const particleTheme = screen === "welcome" || screen === "character" ? "welcome"
    : ["topics", "exercise", "flashcards", "express"].includes(screen) ? (grade || "welcome") : "welcome";
  const accentColor = character ? CHARACTERS[character].color : null;
  const hideNav = ["exercise", "flashcards", "express"].includes(screen);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #0f0c29 0%, #1a1333 30%, #24243e 70%, #0f0c29 100%)",
      color: "#fff", maxWidth: 430, margin: "0 auto",
      position: "relative", overflow: "hidden",
      fontFamily: "Nunito, sans-serif", WebkitFontSmoothing: "antialiased",
    }}>
      <ThemedParticles theme={particleTheme} accentColor={accentColor} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
        {screen === "character" && <CharacterScreen onSelect={handleSelectCharacter} />}
        {screen === "grade" && (
          <GradeScreen character={character}
            onSelect={handleSelectGrade}
            onMethod={() => setScreen("method")}
          />
        )}
        {screen === "method" && <MethodScreen character={character} onBack={goBack} />}
        {screen === "topics" && (
          <TopicsScreen
            character={character} grade={grade}
            mode={topicMode} setMode={setTopicMode}
            onSelect={handleTopicSelect}
            onBack={goBack}
            reviewTopics={reviewTopics}
          />
        )}
        {screen === "exercise" && (
          <ExerciseScreen character={character} topicId={topic}
            xp={xp} setXp={setXp} level={level} setLevel={setLevel} onBack={goBack}
            onComplete={handleExerciseComplete}
          />
        )}
        {screen === "flashcards" && (
          <FlashcardsScreen character={character} topicId={topic}
            topicTitle={getTopicTitle()} onBack={goBack}
            onMarkReview={markForReview} onClearReview={clearFromReview}
          />
        )}
        {screen === "express" && (
          <ExpressTestScreen character={character} topicId={topic}
            topicTitle={getTopicTitle()} onBack={goBack}
            onComplete={handleExpressComplete}
          />
        )}
      </div>
      {!hideNav && <BottomNav onBack={goBack} canGoBack={canGoBack} charColor={accentColor} />}
    </div>
  );
}
