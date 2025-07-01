import React from "react";
import { useParams, Link } from "react-router-dom";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import EditProjectDialog from "@/components/workspace/project/edit-project-dialog";
import { deleteProjectMutationFn } from "@/lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getAllTasksQueryFn } from "@/lib/api";

const Projects: React.FC = () => {
    const queryClient = useQueryClient();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { data, isLoading, error } = useGetProjectsInWorkspaceQuery({ workspaceId: workspaceId || "" });
    const { onOpen } = useCreateProjectDialog();

    const deleteMutation = useMutation({
        mutationFn: deleteProjectMutationFn,
        onSuccess: () => {
            toast({ title: "Project deleted", variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["allprojects", workspaceId] });
        },
        onError: () => {
            toast({ title: "Failed to delete project", variant: "destructive" });
        },
    });

    const handleDelete = (projectId: string) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate({ workspaceId: workspaceId || "", projectId });
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Button onClick={onOpen}>Create Project</Button>
            </div>
            <CreateProjectDialog />
            {isLoading ? (
                <div>Loading projects...</div>
            ) : error ? (
                <div className="text-red-500">Failed to load projects.</div>
            ) : !data || !data.projects || data.projects.length === 0 ? (
                <div>No projects found in this workspace.</div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {data.projects.map((project: any) => {
                        const { data: tasksData } = useQuery({
                            queryKey: ["tasks", workspaceId, project._id],
                            queryFn: () => getAllTasksQueryFn({
                                workspaceId: workspaceId || "",
                                projectId: project._id,
                            }),
                        });
                        const taskCount = (tasksData as any)?.tasks?.length ?? 0;
                        return (
                            <Link
                                key={project._id}
                                to={`/workspace/${workspaceId}/projects/${project._id}`}
                                className="border rounded p-4 bg-white shadow hover:bg-gray-50 transition block relative"
                            >
                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                    <EditProjectDialog project={project} />
                                    <button onClick={e => { e.preventDefault(); handleDelete(project._id); }} title="Delete" className="text-red-500 hover:text-red-700">
                                        &#128465;
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{project.emoji}</span>
                                    <span className="text-lg font-semibold">{project.name}</span>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">{project.description || "No description"}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Owner:</span>
                                    <span className="font-medium">{project.createdBy?.name || "-"}</span>
                                    {project.createdBy?.profilePicture && (
                                        <img src={project.createdBy.profilePicture} alt="Owner" className="h-5 w-5 rounded-full ml-1" />
                                    )}
                                    <span className="ml-auto">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">Tasks: {taskCount}</div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Projects; 