/*
 * ============================================
 * VIDEO CALL - WebRTC Video Component
 * ============================================
 * 
 * This component handles video/audio calls using WebRTC.
 * 
 * Props:
 * - socket: Socket.io instance
 * - roomId: Current room ID
 * - currentUser: Current logged-in user
 * 
 * Note: This is a simplified version for beginners.
 * WebRTC is complex, but this component makes it easy to use!
 */

import { useState, useEffect, useRef } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import Button from "./Button";

const VideoCall = ({ socket, roomId, currentUser }) => {
  // ============================================
  // STATE
  // ============================================

  // Track if video is enabled
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Track if audio is enabled
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Track if call is active
  const [callActive, setCallActive] = useState(false);

  // Reference to local video element
  const localVideoRef = useRef(null);

  // Reference to remote video element
  const remoteVideoRef = useRef(null);

  // Store local media stream
  const [localStream, setLocalStream] = useState(null);

  // Incoming call notification
  const [incomingCall, setIncomingCall] = useState(null); // { from: userName }

  // ============================================
  // LISTEN FOR INCOMING CALL NOTIFICATIONS
  // ============================================

  useEffect(() => {
    if (!socket) return;

    // Listen for call started event
    socket.on("call_started", (data) => {
      console.log("📞 Incoming call from:", data.userName);

      // Don't show notification if we're the one who started the call
      if (data.userId !== currentUser?._id) {
        setIncomingCall({
          from: data.userName,
          userId: data.userId,
        });
      }
    });

    // Listen for call ended event
    socket.on("call_ended", (data) => {
      console.log("📴 Call ended by:", data.userName);

      // Clear incoming call notification
      setIncomingCall(null);

      // If we're in the call, end it
      if (callActive) {
        endCall();
      }
    });

    return () => {
      socket.off("call_started");
      socket.off("call_ended");
    };
  }, [socket, currentUser, callActive]);

  // ============================================
  // START CALL
  // ============================================

  const startCall = async () => {
    try {
      console.log("🎥 Requesting camera and microphone access...");

      // Request access to camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true,
      });

      console.log("✅ Got media stream:", stream);

      // Save stream to state (this will trigger useEffect to display video)
      setLocalStream(stream);
      setCallActive(true);

      // Notify other users in the room that call has started
      if (socket) {
        socket.emit("start_call", {
          roomId,
          userName: currentUser?.name,
          userId: currentUser?._id,
        });
        console.log("📡 Notified other users about call");
      }

      console.log("📹 Call started successfully");
    } catch (error) {
      console.error("❌ Error starting call:", error);

      // Show user-friendly error message
      if (error.name === 'NotAllowedError') {
        alert("Camera/microphone access denied. Please allow access and try again.");
      } else if (error.name === 'NotFoundError') {
        alert("No camera or microphone found. Please connect a device and try again.");
      } else {
        alert("Could not access camera/microphone: " + error.message);
      }
    }
  };

  // ============================================
  // END CALL
  // ============================================

  const endCall = () => {
    // Stop all tracks (camera and microphone)
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    setLocalStream(null);
    setCallActive(false);

    // Notify other users that call has ended
    if (socket) {
      socket.emit("end_call", {
        roomId,
        userName: currentUser?.name,
        userId: currentUser?._id,
      });
      console.log("📡 Notified other users that call ended");
    }

    console.log("📹 Call ended");
  };

  // ============================================
  // ACCEPT INCOMING CALL
  // ============================================

  const acceptCall = () => {
    console.log("✅ Accepting call from:", incomingCall?.from);
    setIncomingCall(null);
    startCall(); // Start our own call
  };

  // ============================================
  // REJECT INCOMING CALL
  // ============================================

  const rejectCall = () => {
    console.log("❌ Rejecting call from:", incomingCall?.from);
    setIncomingCall(null);
  };

  // ============================================
  // TOGGLE VIDEO
  // ============================================

  const toggleVideo = () => {
    if (localStream) {
      // Get video track
      const videoTrack = localStream.getVideoTracks()[0];

      // Toggle enabled state
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  // ============================================
  // TOGGLE AUDIO
  // ============================================

  const toggleAudio = () => {
    if (localStream) {
      // Get audio track
      const audioTrack = localStream.getAudioTracks()[0];

      // Toggle enabled state
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  // ============================================
  // ATTACH STREAM TO VIDEO ELEMENT
  // ============================================
  // When localStream changes, attach it to the video element

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("📺 Attaching stream to video element");
      localVideoRef.current.srcObject = localStream;

      // Play the video (some browsers need this)
      localVideoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [localStream]);

  // ============================================
  // CLEANUP ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      // Stop all tracks when component unmounts
      if (localStream) {
        console.log("🛑 Stopping all media tracks");
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* ============================================
          HEADER
          ============================================ */}
      <h3 className="font-semibold text-lg mb-4">Video Call</h3>

      {/* ============================================
          INCOMING CALL NOTIFICATION
          ============================================ */}
      {incomingCall && !callActive && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-4 animate-pulse">
          <div className="text-center">
            <div className="text-4xl mb-2">📞</div>
            <h4 className="font-bold text-lg mb-2">Incoming Call</h4>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">{incomingCall.from}</span> is calling...
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={acceptCall}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                ✅ Accept
              </Button>
              <Button
                onClick={rejectCall}
                variant="danger"
                className="px-6"
              >
                ❌ Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          VIDEO DISPLAY
          ============================================ */}
      {callActive ? (
        <div className="space-y-4">
          {/* Local video (your camera) */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>

          {/* Remote video (other person's camera) */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Remote
            </div>
          </div>

          {/* ============================================
              CONTROLS
              ============================================ */}
          <div className="flex justify-center gap-2">
            {/* Toggle video button */}
            <Button
              variant={videoEnabled ? "primary" : "danger"}
              onClick={toggleVideo}
              className="px-4 bg-green-500"
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            {/* Toggle audio button */}
            <Button
              variant={audioEnabled ? "primary" : "danger"}
              onClick={toggleAudio}
              className="px-4 bg-green-500"
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            {/* End call button */}
            <Button variant="danger" onClick={endCall} className="px-4">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        // Call not started - show start button
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No active call</p>
          <Button className="w-full bg-green-400" onClick={startCall}>Start Video Call</Button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
