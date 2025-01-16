interface CommandRequest {
  command: string;
  designId: string;
  parameters?: Record<string, unknown>;
}

interface CommandResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
}

const createErrorResponse = (message: string): CommandResponse => ({
  success: false,
  message,
  error: message
});

export const handler = async (req: Request): Promise<Response> => {
  try {
    const { command, designId, parameters } = await req.json() as CommandRequest;

    if (!command || !designId) {
      return new Response(
        JSON.stringify(createErrorResponse('Command and designId are required')),
        { status: 400 }
      );
    }

    const response: CommandResponse = {
      success: true,
      message: `Processed ${command} for design ${designId}`,
      data: parameters
    };

    return new Response(
      JSON.stringify(response),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(createErrorResponse('Failed to process command')),
      { status: 500 }
    );
  }
};