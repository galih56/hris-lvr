<?php
namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Interfaces\ShiftRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;
use App\Http\Resources\ShiftResource;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    private ShiftRepositoryInterface $shiftRepository;
    
    public function __construct(ShiftRepositoryInterface $shiftRepository)
    {
        $this->shiftRepository = $shiftRepository;
    }

    public function searchShift(Request $request){
        
        $keyword = $request->query('keyword');

        $filters = [];

        if($keyword){
            $filters[] = [
                'code:like' => $keyword,
                'name:like' => $keyword,
                'description:like' => $keyword,
                'start:like' => $keyword,
                'end:like' => $keyword,
            ];
        }

        $employees = $this->shiftRepository->searchShift($filters);
        
        return ApiResponse::sendResponse(ShiftResource::collection($employees), null, 'success', 200);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;

        $filters = [];

        $data = $this->shiftRepository->get($filters, $perPage, []);

        if($perPage){
            $shifts = [
                'data' => ShiftResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($shifts,200);
        }else{
            $shifts = ShiftResource::collection($data);
            return ApiResponse::sendResponse($shifts,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShiftRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            
            $shift = $this->shiftRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($shift,'Employee Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $shift = $this->shiftRepository->find($id);

        return ApiResponse::sendResponse(new ShiftResource($shift),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateShiftRequest $request)
    {
        DB::beginTransaction();
        try{
            $shift = $this->shiftRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $shift , 'Employee Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->shiftRepository->delete($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }
}
