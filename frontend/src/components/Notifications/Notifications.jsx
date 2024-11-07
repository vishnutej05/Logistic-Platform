import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Badge,
  Popper,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fade,
} from "@mui/material";
import { IoMdNotifications } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const NotificationWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    transition: "all 0.3s ease-in-out",
  },
}));

const NotificationPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1000,
  width: "320px",
  maxWidth: "90vw",
  "@media (max-width: 600px)": {
    width: "280px",
  },
}));

const NotificationPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  maxHeight: "400px",
  overflow: "auto",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
}));

const NotificationIcon = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      description: "You have received a new message from John Doe",
      time: "2 minutes ago",
      avatar: "images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      description: "Team meeting starts in 30 minutes",
      time: "30 minutes ago",
      avatar: "images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    },
    {
      id: 3,
      title: "Task Update",
      description: "Project deadline has been updated",
      time: "1 hour ago",
      avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  ]);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClose);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClose);
    };
  }, [open]);

  return (
    <NotificationWrapper>
      <IconButton
        color="primary"
        ref={anchorRef}
        onClick={handleToggle}
        aria-label="notifications"
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
      >
        <StyledBadge badgeContent={notifications.length} color="error">
          <IoMdNotifications size={24} />
        </StyledBadge>
      </IconButton>

      <NotificationPopper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <NotificationPaper>
              <NotificationHeader>
                <Typography variant="h6" component="h2">
                  Notifications
                </Typography>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleClose}
                  aria-label="close notifications"
                >
                  <IoCloseOutline />
                </IconButton>
              </NotificationHeader>

              <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      borderRadius: "8px",
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`https://${notification.avatar}`}
                        alt={notification.title}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.description}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {notification.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </NotificationPaper>
          </Fade>
        )}
      </NotificationPopper>
    </NotificationWrapper>
  );
};

export default NotificationIcon;
