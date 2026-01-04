import {useCallback, useState, useRef, useEffect} from "react";
import {Handle, Position} from "reactflow";
import {ChevronRight, ChevronDown, MoreVertical} from "lucide-react";

type CourseNodeData = {
  label: string;
  type: "center" | "domain" | "branch" | "course" | "lesson";
  description?: string;
  locked?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onExpand?: (nodeId: string) => void;
  onCollapse?: (nodeId: string) => void;
};

type CourseNodeProps = {
  id: string;
  data: CourseNodeData;
};

export function CourseNode({data, id}: CourseNodeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node | null)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onExpand) {
        data.onExpand(id);
      }
    },
    [data, id]
  );

  const handleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onCollapse) {
        data.onCollapse(id);
      }
    },
    [data, id]
  );

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const canExpand = data.hasChildren && !data.isExpanded;
  const canCollapse = data.hasChildren && data.isExpanded;
  const isCenter = data.type === "center";

  return (
    <div
      className="relative bg-white border-2 rounded-lg shadow-lg p-3 min-w-[200px]"
      style={{
        borderColor: isCenter
          ? "hsl(var(--primary))"
          : "hsl(var(--primary))",
        borderWidth: isCenter ? "3px" : "2px",
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <Handle type="source" position={Position.Right} className="!bg-primary" />

      {/* Node content */}
      <div className="flex items-center justify-between gap-2">
        {/* Expand/Collapse button */}
        {!isCenter && (canExpand || canCollapse) && (
          <button
            onClick={canExpand ? handleExpand : handleCollapse}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={canExpand ? "Expand" : "Collapse"}
          >
            {canExpand ? (
              <ChevronRight className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )}
          </button>
        )}
        {isCenter && <div className="w-6" />}

        {/* Label */}
        <div className="flex-1 text-center">
          <div className="font-semibold text-lg">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-1">
              {data.description}
            </div>
          )}
        </div>

        {/* Menu button */}
        {!isCenter && (
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Menu"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      // Add your menu actions here
                      console.log("View details", id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      console.log("Edit", id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      console.log("Delete", id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-destructive transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {isCenter && <div className="w-6" />}
      </div>
    </div>
  );
}

