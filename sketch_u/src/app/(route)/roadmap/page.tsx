"use client";
  
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import ProfileButton from '@/app/_components/profile';
import NewRoadmap from '@/app/_components/newRoadmap';
import { RoadmapService } from '@/services/roadmapService';
import { RoadmapListResponse } from '@/types/roadmap';
import type { SessionItem } from '@/types/roadmap';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const PageName = styled.div`
  font-size: 40px;
  font-weight: 600;
  margin-left: 31px;
  margin-top: 16px;
`;  

const ContentContainer = styled.div`
  margin-top: 26px;
  margin-bottom: 38px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100vh - 120px);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 64.6%;
  background: transparent;
  padding: 1rem;
  border-radius: 13px;
  height: 100%;
  padding: 0 59px;
  
`;

const Content = styled.div`
  background: #F2F2F2;
  border-radius: 13px;
  width: 35%;
  height: 100%;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
`;

const HeaderIcons = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const CloseIcon = styled.span`
  position: absolute;
  left: 20px;
  cursor: pointer;
`;

const ContentHeader = styled.div`
  padding: 20px 26px 10px 26px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HeaderTitle = styled.div`
  font-size: 26px;
  font-weight: 600;
  text-align: left;
  margin-top: 20px;
`;

const ContentBody = styled.div`
  padding: 0px 26px 18px 26px;
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 600;
  color: #3C3C3C;
`;

const MemoTitle = styled.div`
  font-weight: 600;
  font-size: 26px;
  margin: 5px 0 5px 0;
`;

const MemoContent = styled.textarea`
  background: #FFFFFF;
  padding: 15px;
  border-radius: 8px;
  flex: 1;
  margin: 0 0 20px 0;
  color: #3C3C3C;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: inherit;

  &:focus {
    outline: none;
  }
`;

const SaveButton = styled.button<{ isActive: boolean }>`
  width: calc(100% - 52px);
  height: 37px;
  margin: 0 26px 19px 26px;
  background: ${props => props.isActive ? '#90D8BF' : '#D9D9D9'};
  border: none;
  border-radius: 13px;
  color: ${props => props.isActive ? '#000000' : '#666666'};
  font-weight: 600;
  font-size: 17px;
  cursor: ${props => props.isActive ? 'pointer' : 'default'};

  &:hover {
    background: ${props => props.isActive ? '#7EC5AD' : '#D9D9D9'};
  }
`;

const CancelButton = styled(SaveButton)`
  background: #FF9494;
  color: #000000;
  cursor: pointer;

  &:hover {
    background: #FF7070;
  }
`;

const RoadmapTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 33px;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  height: 2px;
  background-color: #525252;
  margin: 1rem 0;
`;

const SessionList = styled.ul`
  list-style-type: none;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding-right: 20px;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #90D8BF;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #7EC5AD;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-right: 12px;
  padding-bottom: 13px;
`;

const StatusIcon = styled.div`
  position: absolute;
  top: 13px;
  right: 12px;
`;

const SessionItem = styled.li<{ status: 'completed' | 'current' | 'upcoming'; selected: boolean }>`
    width: 100%;
    height: 113px;
    padding-left: 12px;
    margin-left: 5px;
    padding-top: 13px;
    margin-bottom: 1rem;
    background: ${(props) => {
        switch (props.status) {
            case 'completed':
                return '#F6F9F3';
            case 'current':
                return '#90D8BF';
            case 'upcoming':
                return '#F2F2F2';
        }
    }};
    border-radius: 13px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: ${props => props.selected ? '0px 4px 5px rgba(0, 0, 0, 0.25)' : 'none'};
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    }
`;

const SessionTitleContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`;

const Number = styled.div`
    font-size: 26px;
    color: #3C3C3C;
    font-weight: 600;
`;

const Title = styled.div`
    margin-left: 7px;
    font-size: 23px;
    color: #000000;
    font-weight: 600;
`;

const SessionDescription = styled.div`
    font-size: 18px;
    color: #3C3C3C;
    font-weight: 400;
`;

const Note = styled.div`
  margin-top: 1rem;
`;

const ContentDivider = styled.hr`
  border: none;
  height: 2px;
  background-color: #525252;
  margin: 67px 0 0px 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 13px;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  padding: 40px;
  border-radius: 13px;
  width: 450px;
  text-align: center;
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.15));
`;

const ModalTitle = styled.h3`
  font-size: 26px;
  font-weight: 600;
  color: #3C3C3C;
  margin-bottom: 15px;
`;

const ModalDescription = styled.p`
  font-size: 18px;
  color: #525252;
  margin-bottom: 30px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ModalButton = styled.button`
  width: 122px;
  height: 50px;
  border: none;
  border-radius: 25px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  
  &.cancel {
    background: #E9E9E9;
    color: #141414;
    
    &:hover {
      background: #d9d9d9;
    }
  }
  
  &.confirm {
    background: #FF9494;
    color: #000000;
    
    &:hover {
      background: #FF7070;
    }
  }
`;

const DateContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  color: #525252;
  font-size: 16px;
  font-weight: 400;
`;

const DateLabel = styled.span`
  color: #3C3C3C;
  font-weight: 600;
`;

const CancelEditButton = styled.span`
  cursor: pointer;
  padding: 5px;
  
  img {
    filter: invert(63%) sepia(54%) saturate(7483%) hue-rotate(325deg) brightness(101%) contrast(101%);
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const TooltipContainer = styled.div<{ isVisible: boolean; isError?: boolean }>`
  position: fixed;
  background: ${props => props.isError ? '#FF9494' : '#FFFFFF'};
  color: ${props => props.isError ? '#FFFFFF' : '#3C3C3C'};
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  z-index: 1000;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15));
`;

interface UserEntity {
  id: number;
  username: string;
  password: null;
}

interface RoadmapData {
  roadmapId: number;
  userEntity: UserEntity;
  achieved: number;
  clear: boolean;
  sessionData: SessionItem[];
}

// API 호출을 위한 함수 추가
const updateRoadmap = async (updatedData: RoadmapData) => {
  try {
    const response = await RoadmapService.apiFetch('/roadmap/updateroadmap', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // 액세스 토큰 추가
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('로드맵 업데이트 실패:', error);
  }
};

// Add the saveRoadmap function
const saveRoadmap = async (updatedData: RoadmapData) => {
  try {
    console.log({
      ...updatedData,
      sessionData: JSON.stringify(updatedData.sessionData)
    });
    const response = await RoadmapService.apiFetch('/roadmap/saveroadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        ...updatedData,
        sessionData: JSON.stringify(updatedData.sessionData)
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('로드맵 저장 실패:', error);
  }
};

export default function HomePage() {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTopic, setEditedTopic] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedDeadline, setEditedDeadline] = useState('');
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const initialRoadmapData: RoadmapData = {
    roadmapId: 1,
    userEntity: {
      id: 1,
      username: "testUser",
      password: null
    },
    achieved: 3,
    clear: false,
    sessionData: [
        {
          seq: 1,
          topic: "기타 구매하기",
          description: "150만원짜리 펜더 텔레캐스터를 구매하세요!",
          start_date: "2024-03-20",
          deadline: "2024-03-25",
          note: null
        },
        {
          seq: 2,
          topic: "피킹 연습하기",
          description: "크로매틱 연습을 통해 300 bpm까지 연습해보세요!",
          start_date: "2024-03-26",
          deadline: "2024-03-30",
          note: null
        },
        {
          seq: 3,
          topic: "노래 연주해보기",
          description: "반짝반짝 작은별 노래를 연주해보며, 사용감을 익히세요!",
          start_date: "2024-04-01",
          deadline: "2024-04-05",
          note: null
        },
        {
          seq: 4,
          topic: "해머링 & 풀링",
          description: "해머링과 풀링을 연습하여 원손의 다양한 기술을 습득해보세요!",
          start_date: "2024-04-06",
          deadline: "2024-04-10",
          note: null
        },
        {
          seq: 5,
          topic: "스윕 피킹",
          description: "설명설명설명설명설명설명설명설명설명",
          start_date: "2024-04-11",
          deadline: "2024-04-15",
          note: null
        },
        {
          seq: 6,
          topic: "기타 줄 끊보기",
          description: "기타 줄을 4개로 만들어보아요!",
          start_date: "2024-04-16",
          deadline: "2024-04-20",
          note: null
        }
      ]
  };

  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchRoadmap = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const roadmapId = searchParams.get('roadmapId');
      
      if (!roadmapId) {
        router.push('/roadmapList');
        return;
      }

      const result = await RoadmapService.getRoadmap(parseInt(roadmapId));
      
      if (result.success && result.data) {
        setRoadmapData({
          ...result.data,
          sessionData: Array.isArray(result.data.sessionData) ? result.data.sessionData : []
        });
      } else {
        if (result.error === 'Unauthorized') {
          router.push('/login');
          return;
        }
        if (result.error === 'Roadmap not found') {
          router.push('/roadmapList');
          return;
        }
        console.error('Failed to fetch roadmap:', result.error);
      }
    };

    fetchRoadmap();
  }, [router]);

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  // handleNoteChange 함수 수정
  const handleNoteChange = async (note: string) => {
    if (selectedSession === null) return;
    
    const newData = {
      ...roadmapData,
      sessionData: Array.isArray(roadmapData.sessionData) ? 
        roadmapData.sessionData.map((session, index) => 
          index === selectedSession ? { ...session, note } : session
        ) : []
    };
    
    setRoadmapData(newData);
    await saveRoadmap(newData);
  };

  const handleEditClick = () => {
    if (selectedSession !== null) {
      setEditedTopic(roadmapData.sessionData[selectedSession].topic);
      setEditedDescription(roadmapData.sessionData[selectedSession].description);
      setEditedStartDate(roadmapData.sessionData[selectedSession].start_date);
      setEditedDeadline(roadmapData.sessionData[selectedSession].deadline);
      setIsEditing(true);
    }
  };

  const showTooltipMessage = (message: string, isError: boolean = false) => {
    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  // handleSaveEdit 함수 수정
  const handleSaveEdit = async () => {
    if (selectedSession === null) return;
    
    if (new Date(editedStartDate) > new Date(editedDeadline)) {
      showTooltipMessage('시작일은 마감일보다 늦을 수 없습니다.', true);
      return;
    }

    let updatedSessions = Array.isArray(roadmapData.sessionData) ? 
      [...roadmapData.sessionData] : [];
    let adjustmentsMade = false;

    // 이전 세션들 재귀적 조정
    const adjustPreviousSessions = (currentIndex: number, newDeadline: string) => {
      if (currentIndex <= 0) return;
      
      const prevSession = updatedSessions[currentIndex - 1];
      const prevDeadline = new Date(prevSession.deadline);
      const newDeadlineDate = new Date(newDeadline);
      
      if (prevDeadline > newDeadlineDate) {
        // 새로운 시작일 계산 (마감일과 동일한 간격 유지)
        const originalDuration = prevDeadline.getTime() - new Date(prevSession.start_date).getTime();
        const newStartDate = new Date(newDeadlineDate.getTime() - originalDuration);
        
        updatedSessions[currentIndex - 1] = {
          ...prevSession,
          start_date: newStartDate.toISOString().split('T')[0],
          deadline: newDeadline
        };
        adjustmentsMade = true;
        
        // 이전 세션의 시작일이 그 이전 션의 마감일보다 앞서면 재귀 호출
        adjustPreviousSessions(currentIndex - 1, newStartDate.toISOString().split('T')[0]);
      }
    };

    // 다음 세션들 재귀적 조정
    const adjustNextSessions = (currentIndex: number, newStartDate: string) => {
      if (currentIndex >= updatedSessions.length - 1) return;
      
      const nextSession = updatedSessions[currentIndex + 1];
      const nextStartDate = new Date(nextSession.start_date);
      const newStartDateObj = new Date(newStartDate);
      
      if (nextStartDate < newStartDateObj) {
        // 새로운 마감일 계산 (시작일과 동일한 간격 유지)
        const originalDuration = new Date(nextSession.deadline).getTime() - nextStartDate.getTime();
        const newDeadline = new Date(newStartDateObj.getTime() + originalDuration);
        
        updatedSessions[currentIndex + 1] = {
          ...nextSession,
          start_date: newStartDate,
          deadline: newDeadline.toISOString().split('T')[0]
        };
        adjustmentsMade = true;
        
        // 다음 세션의 마감일이 그 다음 세션의 시작일보다 늦으면 재귀 호출
        adjustNextSessions(currentIndex + 1, newDeadline.toISOString().split('T')[0]);
      }
    };

    // 전 세션들 조정
    adjustPreviousSessions(selectedSession, editedStartDate);

    // 다음 세션들 조정
    adjustNextSessions(selectedSession, editedDeadline);

    // 현재 세션 업데이트
    updatedSessions[selectedSession] = {
      ...updatedSessions[selectedSession],
      topic: editedTopic,
      description: editedDescription,
      start_date: editedStartDate,
      deadline: editedDeadline
    };

    const newData = {
      ...roadmapData,
      sessionData: updatedSessions
    };

    setRoadmapData(newData);
    setIsEditing(false);

    if (adjustmentsMade) {
      showTooltipMessage('인접한 세션들의 날짜를 앞당기거나 미루었습니다.');
    }

    await saveRoadmap(newData);
  };

  const handleSessionComplete = async () => {
    if (selectedSession === roadmapData.achieved) {
      const newData = {
        ...roadmapData,
        achieved: roadmapData.achieved + 1
      };
      
      setRoadmapData(newData);
      await saveRoadmap(newData);
      
      if (selectedSession < roadmapData.sessionData.length - 1) {
        setSelectedSession(selectedSession + 1);
      }
      setIsEditing(false);
    }
  };

  const handleSessionCancel = async () => {
    const newData = {
      ...roadmapData,
      achieved: roadmapData.achieved - 1
    };
    
    setRoadmapData(newData);
    await saveRoadmap(newData);
  };

  const handleAddSession = () => {
    if (selectedSession === null) return;
    
    const newSession: SessionItem = {
      seq: Array.isArray(roadmapData.sessionData) ? 
        roadmapData.sessionData[selectedSession].seq + 1 : 1,
      topic: "새로운 세션",
      description: "설명을 입력하세요",
      start_date: "2024-04-21",
      deadline: "2024-04-25",
      note: null
    };
    
    setRoadmapData(prev => {
      if (!prev) return null;
      const currentSessions = Array.isArray(prev.sessionData) ? prev.sessionData : [];
      const updatedSessions = [
        ...currentSessions.slice(0, selectedSession + 1),
        newSession,
        ...currentSessions.slice(selectedSession + 1).map(session => ({
          ...session,
          seq: session.seq + 1
        }))
      ];
      
      return {
        ...prev,
        sessionData: updatedSessions
      };
    });

    setSelectedSession(selectedSession + 1);
    setIsEditing(true);
    setEditedTopic("새로운 세션");
    setEditedDescription("설명을 입력하세요");
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSession === null) return;
    
    setRoadmapData(prev => {
      if (!prev) return null;
      const currentSessions = Array.isArray(prev.sessionData) ? prev.sessionData : [];
      const updatedSessions = currentSessions.filter((_, index) => index !== selectedSession);
      const reorderedSessions = updatedSessions.map((session, index) => ({
        ...session,
        seq: index + 1
      }));
      
      return {
        ...prev,
        sessionData: reorderedSessions,
        achieved: selectedSession < prev.achieved ? prev.achieved - 1 : prev.achieved
      };
    });
    
    setShowDeleteModal(false);
    setSelectedSession(null);
  };

  return (
    <Container>
      <ProfileButton />
      <NewRoadmap />

      <PageName>내 로드맵</PageName>
      <ContentContainer>
        <Sidebar>
          <RoadmapTitle>일렉기타</RoadmapTitle>
          <Divider />
          <SessionList>
            {roadmapData.sessionData.map((session, index) => (
              <SessionItem
                key={index}
                status={
                  index < roadmapData.achieved
                    ? 'completed'
                    : index === roadmapData.achieved
                    ? 'current'
                    : 'upcoming'
                }
                selected={selectedSession === index}
                onClick={() => {
                  setSelectedSession(index);
                  setIsEditing(false);
                }}
              >
                  <SessionTitleContainer>
                      <Number>{session.seq < 10 ? '0' + session.seq : session.seq}</Number>
                      <Title>{session.topic}</Title>
                  </SessionTitleContainer>
                  <SessionDescription>{session.description}</SessionDescription>
                  {index < roadmapData.achieved && (
                    <StatusIcon>
                      <img src="/icons/completed.svg" alt="completed" />
                    </StatusIcon>
                  )}
                  <IconContainer>
                    <div></div>
                    {session.note && <img src="/icons/memo.svg" alt="memo" />}
                  </IconContainer>
              </SessionItem>
            ))}
          </SessionList>
        </Sidebar>  
        <Content>
          {selectedSession !== null && (
            <>
              <ContentHeader>
                <CloseIcon onClick={() => setSelectedSession(null)}>
                  <img src="/icons/close.svg" alt="back" />
                </CloseIcon>
                <HeaderIcons>
                  {isEditing ? (
                    <>
                      <CancelEditButton onClick={() => {
                        setIsEditing(false);
                        setEditedTopic(roadmapData.sessionData[selectedSession].topic);
                        setEditedDescription(roadmapData.sessionData[selectedSession].description);
                        setEditedStartDate(roadmapData.sessionData[selectedSession].start_date);
                        setEditedDeadline(roadmapData.sessionData[selectedSession].deadline);
                      }}>
                        <img src="/icons/cancel.svg" alt="cancel" />
                      </CancelEditButton>
                      <span onClick={handleSaveEdit}>
                        <img src="/icons/save.svg" alt="save" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span onClick={handleAddSession}>
                        <img src="/icons/add.svg" alt="add" />
                      </span>
                      <span onClick={handleEditClick}>
                        <img src="/icons/edit.svg" alt="edit" />
                      </span>
                    </>
                  )}
                  <span onClick={handleDeleteClick}><img src="/icons/delete.svg" alt="delete" /></span>
                </HeaderIcons>
                <HeaderTitle>
                  {isEditing ? (
                    <input
                      value={editedTopic}
                      onChange={(e) => setEditedTopic(e.target.value)}
                      style={{
                        fontSize: '26px',
                        fontWeight: '600',
                        width: '100%',
                        border: 'none',
                        background: '#F2F2F2',
                        padding: '5px'
                      }}
                    />
                  ) : (
                    (roadmapData.sessionData[selectedSession].seq < 10 ? '0' : '') + 
                    roadmapData.sessionData[selectedSession].seq + 
                    ' ' + 
                    roadmapData.sessionData[selectedSession].topic
                  )}
                </HeaderTitle>
                <DateContainer>
                  <div>
                    <DateLabel>시작일: </DateLabel>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedStartDate}
                        onChange={(e) => setEditedStartDate(e.target.value)}
                        style={{
                          border: 'none',
                          background: '#FFFFFF',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    ) : (
                      roadmapData.sessionData[selectedSession].start_date
                    )}
                  </div>
                  <div>
                    <DateLabel>마감일: </DateLabel>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedDeadline}
                        onChange={(e) => setEditedDeadline(e.target.value)}
                        style={{
                          border: 'none',
                          background: '#FFFFFF',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    ) : (
                      roadmapData.sessionData[selectedSession].deadline
                    )}
                  </div>
                </DateContainer>
              </ContentHeader>
              <ContentBody>
                {isEditing ? (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      border: 'none',
                      background: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}
                  />
                ) : (
                  <p>{roadmapData.sessionData[selectedSession].description}</p>
                )}
                <ContentDivider />
                <MemoTitle>메모</MemoTitle>
                <MemoContent
                  value={roadmapData.sessionData[selectedSession].note || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="메모를 입력하세요"
                />
              </ContentBody>
              {selectedSession === roadmapData.achieved - 1 ? (
                <CancelButton 
                  isActive={true}
                  onClick={handleSessionCancel}
                >
                  세션 취소
                </CancelButton>
              ) : (
                <SaveButton 
                  isActive={selectedSession === roadmapData.achieved}
                  onClick={handleSessionComplete}
                >
                  세션 완료
                </SaveButton>
              )}
            </>
          )}
        </Content>
      </ContentContainer>
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>세션을 삭제하시겠습니까?</ModalTitle>
            <ModalDescription>이 작업은 되돌릴 수 없습니다.</ModalDescription>
            <ModalButtons>
              <ModalButton className="cancel" onClick={() => setShowDeleteModal(false)}>
                취소
              </ModalButton>
              <ModalButton className="confirm" onClick={handleDeleteConfirm}>
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
      <TooltipContainer 
        isVisible={showTooltip} 
        isError={tooltipMessage === '시작일은 마감일보다 늦을 수 없습니다.'}
      >
        {tooltipMessage}
      </TooltipContainer>
    </Container>
  );
}
